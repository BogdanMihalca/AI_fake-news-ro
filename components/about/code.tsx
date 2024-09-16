const scrapperCode = `import requests
from bs4 import BeautifulSoup
import json
import concurrent.futures

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def get_article_metadata(article):
    metadata = {}
    row_element = article.find('div', class_='row')
    if row_element:
        date_elements = row_element.find_all('time')
        if len(date_elements) > 0:
            # Get the first date element
            date_element = date_elements[0]
            # Extract the date from the datetime attribute
            date = date_element['datetime']
            metadata["publish_date"] = date
    return metadata

def scrape_news_content(article):
    # Find the div with class 'article-content'
    article_content = article.find('div', class_='article-content')
    if article_content:
        # Find the first paragraph within the article content
        first_paragraph = article_content.find('p')
        if first_paragraph:
            # Extract the text from the first paragraph
            content = first_paragraph.get_text().strip()
            return content
    return ""


def scrape_news_detail(article_url):
    try:
        page = requests.get(article_url)
        article = BeautifulSoup(page.content, 'html.parser')
        title = article.find('h1').get_text().strip()

        tag = "Real News"
        
        content = scrape_news_content(article)
        metadata = get_article_metadata(article)
        article_data = {
            "title": title,
            "content": content,
            "tag": tag,
            **metadata,
        }
        print(f"Scraped article----->: {title}")
        return article_data
    except Exception as e:
        print(f"Error scraping {article_url}: {e}")
        return None


def scrape_news(url, number_of_pages, filename):
    articles_urls = []
    for i in range(1, number_of_pages+1):
        page = requests.get(f'{url}?page={i}')
        soup = BeautifulSoup(page.content, 'html.parser')
        articles = soup.find_all('h2', class_='article-title-link2')
        for article in articles:
            article_url = article.find('a')['href']
            articles_urls.append(article_url)

    scraped_count = 0

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(scrape_news_detail, articles_urls, )

    
    # Write data to file after processing each page
    with open(filename, 'a', encoding='utf-8') as f:
        for result in results:
            if result:
                json.dump(result, f, ensure_ascii=False)
                f.write(',\\n')
                scraped_count += 1

    print(f"\\nTotal articles scraped: {scraped_count}");

def main():
    # url = input("Enter the URL of the website: ")
    url = 'https://www.veridica.ro/stiri/romania'
    number_of_pages = int(input("Enter the number of pages: "))
    filename = input("Enter the filename to save the JSON data: ") + ".json"

    # Create an empty file to store the data
    open(filename, 'w').close()

    scrape_news(url, number_of_pages, filename)

    print("\\nScraping completed. Data saved to", filename)

if __name__ == "__main__":
    main()

`;

const preProcessedCode = `import random
import pandas as pd
import json
import re
import nltk
from nltk.corpus import wordnet
from sklearn.utils import resample

# Ensure that NLTK resources are downloaded
nltk.download('wordnet')
nltk.download('omw-1.4')

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Load the data
data = load_json('../../datasets/combined_data_improved.json')
df = pd.DataFrame(data)

# Basic text preprocessing
def preprocess_text(text):
    # Convert text to lowercase
    text = text.lower()
    # Remove special characters
    text = re.sub(r'\\W', ' ', text)
    # Remove all single characters
    text = re.sub(r'\\s+[a-zA-Z]\\s+', ' ', text)
    # Replace multiple spaces with a single space
    text = re.sub(r'\\s+', ' ', text, flags=re.I)
    return text

# Apply preprocessing
df['content'] = df['content'].apply(preprocess_text)

# Simple synonym replacement function for data augmentation
def synonym_replacement(text, n=2):
    words = text.split()
    new_words = words.copy()
    random_word_list = list(set([word for word in words if wordnet.synsets(word)]))
    random.shuffle(random_word_list)
    num_replaced = 0
    for random_word in random_word_list:
        synonyms = set()
        for syn in wordnet.synsets(random_word):
            for lemma in syn.lemmas():
                synonyms.add(lemma.name())
        if len(synonyms) > 1:
            synonym = list(synonyms)[0]
            new_words = [synonym if word == random_word else word for word in new_words]
            num_replaced += 1
        if num_replaced >= n:
            break

    sentence = ' '.join(new_words)
    return sentence

# Apply augmentation to a copy of the minority class rows
minority_data = df[df['tag'] == 'misinformation']
augmented_texts = minority_data['content'].apply(lambda x: synonym_replacement(x))

# Combine augmented data back into the original dataframe
augmented_data = minority_data.copy()
augmented_data['content'] = augmented_texts
df_augmented = pd.concat([df, augmented_data])

# Handling class imbalance by oversampling minority classes
max_size = df_augmented['tag'].value_counts().max()
lst = [df_augmented]
for class_index, group in df_augmented.groupby('tag'):
    lst.append(group.sample(max_size-len(group), replace=True))
df_balanced = pd.concat(lst)

# Now you have df_balanced ready for further use
print(df_balanced['tag'].value_counts())  # This should show balanced classes

# Save the balanced dataset to a JSON file
def save_to_json(df, file_path):
    df.to_json(file_path, orient='records', lines=True, force_ascii=False)

# Specify the path to save the enhanced dataset
enhanced_dataset_path = '../../datasets/combined_data_improved_result.json'
save_to_json(df_balanced, enhanced_dataset_path)

print(f"Enhanced dataset saved to {enhanced_dataset_path}")`;

const trainingCode = `from transformers import BertTokenizerFast
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from torch.nn.functional import softmax
import numpy as np
import json
from transformers import BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, log_loss, roc_auc_score, roc_curve, auc, confusion_matrix



def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Sample dataset
data = load_json('../datasets/combined_data.json')

# Convert to DataFrame
df = pd.DataFrame(data)

# Splitting data
X = df['content']
y = df['tag']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Load the BERT tokenizer
tokenizer = BertTokenizerFast.from_pretrained('bert-base-multilingual-cased')
label_encoder = LabelEncoder()

# Tokenize the dataset
def tokenize_function(texts):
    return tokenizer(texts, padding=True, truncation=True, max_length=128, return_tensors='pt')





train_encodings = tokenize_function(X_train.tolist())
test_encodings = tokenize_function(X_test.tolist())

class FakeNewsDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx], dtype=torch.long)  # Ensure labels are long type for classification
        return item

    def __len__(self):
        return len(self.labels)
    
# Fit and transform the labels
y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.transform(y_test)



# Create the datasets
train_dataset = FakeNewsDataset(train_encodings, y_train_encoded)
test_dataset = FakeNewsDataset(test_encodings, y_test_encoded)

# # Save label mapping
label_mapping = list(label_encoder.classes_)
# with open('../results/label_mapping.json', 'w') as f:
#     json.dump(label_mapping, f)

# Load BERT model for sequence classification
model = BertForSequenceClassification.from_pretrained('bert-base-multilingual-cased', num_labels=len(np.unique(y)))

# Check if MPS (Metal Performance Shaders) backend is available
if torch.backends.mps.is_available():
    device = torch.device("mps")
    print("Using MPS backend for PyTorch")
else:
    device = torch.device("cpu")
    print("Using CPU backend for PyTorch")

# Set the device
model.to(device)

training_args = TrainingArguments(
    output_dir='../results',
    num_train_epochs=5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
    evaluation_strategy="steps",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset
)

# Train the model
trainer.train()

# save the trained model
# model.save_pretrained('../build/bert_model')
# tokenizer.save_pretrained('../build/bert_tokenizer')


# Metrics storage
results = []
# Predict on the test set
# Predict on the test set
predictions = trainer.predict(test_dataset)


# Get raw model predictions (logits)
logits = predictions.predictions

# Convert logits to probabilities
probabilities = softmax(torch.tensor(logits), dim=-1).numpy()

# Decode the predictions to class labels
preds = np.argmax(probabilities, axis=-1)

# Decode numeric predictions back to string labels
preds_decoded = label_encoder.inverse_transform(preds)

# Calculate metrics
acc = accuracy_score(y_test, preds_decoded)
prec = precision_score(y_test, preds_decoded, average='weighted')
rec = recall_score(y_test, preds_decoded, average='weighted')
f1 = f1_score(y_test, preds_decoded, average='weighted')
logloss = log_loss(y_test_encoded, probabilities)
conf_matrix = confusion_matrix(y_test, preds_decoded)

# If you are using roc_curve or auc, you need to pass the correct inputs
# If you are using roc_curve or auc, you need to pass the correct inputs
fpr, tpr, _ = roc_curve((y_test == 'fake_news').astype(int), probabilities[:, 1])
roc_auc = auc(fpr, tpr)
roc_auc_per_class = {}
for i, cls in enumerate(label_mapping):
    fpr, tpr, _ = roc_curve((y_test == cls).astype(int), probabilities[:, i])
    roc_auc_per_class[cls] = auc(fpr, tpr)

# Specify multi_class parameter for roc_auc_score
roc_auc_micro = roc_auc_score(y_test_encoded, probabilities, average='micro', multi_class='ovr')
roc_auc_macro = roc_auc_score(y_test_encoded, probabilities, average='macro', multi_class='ovr')

# Store the results
results.append({
    'Model': 'BERT',
    'Accuracy': acc,
    'Precision': prec,
    'Recall': rec,
    'F1 Score': f1,
    'Log Loss': logloss,
    'ROC AUC Per Class': roc_auc_per_class,
    'ROC AUC Micro': roc_auc_micro,
    'ROC AUC Macro': roc_auc_macro,
    'Confusion Matrix': conf_matrix,
})

# Save results to json file but make sure to convert numpy arrays to lists and then save
with open('../results/results_mine_bert.json', 'w') as file:
    json.dump(results, file, default=lambda x: x.tolist())

#python -m convert --quantize --task sequence-classification --tokenizer_id ./bert_tokenizer  --model_id ./bert_model`;

export { scrapperCode, preProcessedCode, trainingCode };
