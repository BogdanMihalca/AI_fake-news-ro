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

const preProcessedCode = `import pandas as pd
import json
import regex as re
from tqdm import tqdm
import numpy as np
from gensim.models import KeyedVectors
from imblearn.over_sampling import RandomOverSampler
import random

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)



# Function to load data from JSON file
def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Load the data
data = load_json('../../datasets/combined_data.json')
df = pd.DataFrame(data)

# Improved preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\p{L}\s]', ' ', text)
    text = re.sub(r'\s+\p{L}\s+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Apply preprocessing
df['content'] = df['content'].apply(preprocess_text)

# Load pre-trained fastText embeddings for Romanian
# Download from: https://fasttext.cc/docs/en/crawl-vectors.html
def load_embeddings(file_path):
    print("Loading embeddings...")
    embeddings = KeyedVectors.load_word2vec_format(file_path, binary=False, limit=1000000)  # Limit to 1 million words to save memory
    print("Embeddings loaded.")
    return embeddings

# Provide the path to your downloaded fastText embeddings file
embeddings = load_embeddings('cc.ro.300.vec')

# Synonym replacement function using fastText embeddings
def synonym_replacement(text, embeddings, num_replacements=2):
    words = text.split()
    new_words = words.copy()
    random_word_list = list(set(words))
    random.shuffle(random_word_list)
    num_replaced = 0
    for random_word in random_word_list:
        synonyms = []
        try:
            # Check if the word is in the embeddings
            if random_word in embeddings:
                # Get the most similar words (synonyms)
                similar_words = embeddings.most_similar(random_word, topn=10)
                synonyms = [word for word, similarity in similar_words if word != random_word]
            if synonyms:
                # Choose a random synonym
                synonym = random.choice(synonyms)
                # Replace the word with the synonym
                new_words = [synonym if word == random_word else word for word in new_words]
                num_replaced += 1
            if num_replaced >= num_replacements:
                break
        except KeyError:
            continue
    augmented_text = ' '.join(new_words)
    return augmented_text

# Function to augment data
def augment_data(df, label, augmentations_per_sample):
    augmented_texts = []
    subset = df[df['tag'] == label]
    for text in tqdm(subset['content'], desc=f'Augmenting {label}'):
        for _ in range(augmentations_per_sample):
            augmented_text = synonym_replacement(text, embeddings)
            augmented_texts.append({'content': augmented_text, 'tag': label})
    return pd.DataFrame(augmented_texts)

# Calculate class counts
class_counts = df['tag'].value_counts()
print("Initial class distribution:")
print(class_counts)

# Find the maximum class count
max_count = class_counts.max()

# Augment minority classes
augmented_dfs = []
for label, count in class_counts.items():
    if count < max_count:
        augmentations_per_sample = max(1, (max_count - count) // count)
        print(f"Augmenting class '{label}' with {augmentations_per_sample} augmentations per sample.")
        augmented_df = augment_data(df, label, augmentations_per_sample)
        augmented_dfs.append(augmented_df)
    else:
        print(f"Class '{label}' is already the majority class.")

# Combine augmented data back into the original dataframe
df_augmented = pd.concat([df] + augmented_dfs, ignore_index=True)

# Recalculate class counts after augmentation
class_counts_augmented = df_augmented['tag'].value_counts()
print("Class distribution after augmentation:")
print(class_counts_augmented)

# Balance the dataset using RandomOverSampler
ros = RandomOverSampler(random_state=42)
X = df_augmented['content'].values.reshape(-1, 1)
y = df_augmented['tag']
X_resampled, y_resampled = ros.fit_resample(X, y)
df_balanced = pd.DataFrame({'content': X_resampled.flatten(), 'tag': y_resampled})

# Verify balanced classes
print("Final class distribution after balancing:")
print(df_balanced['tag'].value_counts())

# Save the balanced dataset
def save_to_json(df, file_path):
    df.to_json(file_path, orient='records', lines=True, force_ascii=False)

enhanced_dataset_path = '../../datasets/post_processed/combined_balanced.json'
save_to_json(df_balanced, enhanced_dataset_path)

print(f"Enhanced dataset saved to {enhanced_dataset_path}")
`;

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
