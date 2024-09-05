import * as cheerio from "cheerio";
import { replace } from "lodash";

const getContent = (data: string) => {
  const $ = cheerio.load(data);

  let articleContent = "";

  const commonNewsContentSelectors = [
    "article", // Generic article tag
    "div.article-content", // Common class name
    "div.entry-content", // WordPress common class
    "div.post-content", // Another common class name
    "div.content", // Generic content div
    "main", // Main tag often used for content
    "section.article-body", // Section tag with article-body class
    "div#articleBody", // ID based selector
    "div.story-content", // Another common class
    "div.content-area", // Content area, generic
    "div.story-body", // Class for story body
    "div.text", // Generic class often used for text
    "div.article-body", // Another variation
    "div.news-article", // News-specific content
    "div.blog-post", // Blog post content
    "div.page-content", // Generic page content
    "div#main-content", // ID for main content
    "div.article__content", // BEM naming convention
    "div.content__article-body", // BEM naming, used by some news sites
    "div#bodyContent", // ID for body content
    "div#contentBody", // Another variation for body content
    "div.contentWrapper", // Wrapper around content
    "div.content-post", // Content post
    "div.post-article", // Post article
    "div.body-copy", // Class for the main text
    "div.node-article", // Class for CMS systems like Drupal
  ];

  for (const selector of commonNewsContentSelectors) {
    const selectedElement = $(selector).clone();

    // Remove unwanted elements like scripts, styles, etc.
    selectedElement
      .find("script, style, noscript, iframe, footer, nav, aside, header")
      .remove();

    articleContent = selectedElement.text().trim();
    console.log("i---------------->", articleContent);

    if (articleContent) {
      break;
    }
  }

  console.log("content---------------->", articleContent);
  // If no content is found, try to find the article title
  if (!articleContent) {
    const articleTitleSelectors = [
      "title", // Generic title tag
      'meta[name="title"]', // Meta tag with name attribute
      'meta[property="og:title"]', // Open Graph title
      'meta[name="twitter:title"]', // Twitter title
      "h1.headline", // Headline in an h1 tag
      "h1.entry-title", // WordPress entry title
      "h1.article-title", // Generic article title
      "h1.page-title", // Page title
      "h1.post-title", // Post title
      "h1.news-title", // News title
      "h1.title", // Generic h1 title
      "h1.story-title", // Story title
      "h2.headline", // Sometimes h2 is used for title
      "div.article-header h1", // Title inside a header div
      "div.post-header h1", // Title inside a post header
      "div.story-header h1", // Title inside a story header
      "header.article-header h1", // Header with article class
      "header.entry-header h1", // Entry header with title
      "header.post-header h1", // Post header with title
      "header.page-header h1", // Page header with title
      "header.story-header h1", // Story header with title
      "header h1", // Generic header with title
      "header h2", // Generic header 2 with title
      "h1", // Generic h1 tag
      "h2", // Generic h2 tag
    ];

    for (const selector of articleTitleSelectors) {
      const selectedElement = $(selector).clone();

      // Remove unwanted elements like scripts, styles, etc.
      selectedElement
        .find("script, style, noscript, iframe, footer, nav, aside, header")
        .remove();

      articleContent = selectedElement.text().trim();

      if (articleContent) {
        break;
      }
    }
    console.log("title---------------->", articleContent);
  }

  // If no content is found, try to find the article meta description
  if (!articleContent) {
    const articleMetaDescriptionSelectors = [
      'meta[name="description"]', // Meta tag with description
      'meta[property="og:description"]', // Open Graph description
      'meta[name="twitter:description"]', // Twitter description
      'meta[name="description"]', // Generic description meta tag
      'meta[name="sailthru.description"]', // Sailthru description
      'meta[name="sailthru.title"]', // Sailthru title
      'meta[name="sailthru.image.full"]', // Sailthru image
      'meta[name="sailthru.image.thumb"]', // Sailthru thumbnail
      'meta[name="sailthru.date"]', // Sailthru date
      'meta[name="sailthru.author"]', // Sailthru author
      'meta[name="sailthru.tags"]', // Sailthru tags
      'meta[name="sailthru.link"]', // Sailthru link
      'meta[name="sailthru.allow_url"]', // Sailthru allow URL
      'meta[name="sailthru.hide_image"]', // Sailthru hide image
      'meta[name="sailthru.hide_tags"]', // Sailthru hide tags
      'meta[name="sailthru.hide_author"]', // Sailthru hide author
      'meta[name="sailthru.hide_date"]', // Sailthru hide date
      'meta[name="sailthru.hide_title"]', // Sailthru hide title
      'meta[name="sailthru.hide_description"]', // Sailthru hide description
      'meta[name="sailthru.hide_url"]', // Sailthru hide URL
      'meta[name="sailthru.hide"]', // Sailthru hide
      'meta[name="sailthru"]', // Generic Sailthru meta
    ];

    for (const selector of articleMetaDescriptionSelectors) {
      const selectedElement = $(selector).clone();

      // Remove unwanted elements like scripts, styles, etc.
      selectedElement
        .find("script, style, noscript,footer, nav, aside, header")
        .remove();

      articleContent = selectedElement.text().trim();

      if (articleContent) {
        break;
      }
    }
    console.log("meta---------------->", articleContent);
  }

  if (!articleContent) {
    articleContent = "";
  }

  return articleContent;
};

const preprocessText = (text: string) => {
  // Convert text to lowercase
  text = text.toLowerCase();
  // Remove special characters
  text = replace(text, /\W/g, " ");
  // Remove all single characters
  text = replace(text, /\s+[a-zA-Z]\s+/g, " ");
  // Replace multiple spaces with a single space
  text = replace(text, /\s+/g, " ");

  if (text.length > 2500) {
    text = text.substring(0, 2500);
  }
  return text.trim();
};

export { getContent, preprocessText };
