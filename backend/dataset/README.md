# Dataset Directory

This directory contains datasets used for training and testing the customer support AI system.

## Files

- `sample.csv` - Small sample dataset for testing and development (included in repository)
- `twcs.csv` - Large Twitter Customer Service dataset (excluded from repository due to size)

## Large Dataset Handling

The `twcs.csv` file is excluded from the repository because it exceeds GitHub's 100MB file size limit.

### To use the full dataset:

1. **Download the dataset** from the original source:
   - Twitter Customer Support Dataset: https://www.kaggle.com/thoughtvector/customer-support-on-twitter

2. **Place the file** in this directory:
   ```
   backend/dataset/twcs.csv
   ```

3. **Alternative storage options** for large datasets:
   - Use Git LFS (Large File Storage)
   - Store in cloud storage (AWS S3, Google Cloud Storage, etc.)
   - Use data versioning tools like DVC (Data Version Control)

### Git LFS Setup (Optional)

If you want to track large files with Git LFS:

```bash
# Install Git LFS
git lfs install

# Track large CSV files
git lfs track "*.csv"
git lfs track "backend/dataset/twcs.csv"

# Add .gitattributes file
git add .gitattributes

# Add and commit the large file
git add backend/dataset/twcs.csv
git commit -m "Add large dataset with Git LFS"
```

## Dataset Information

The Twitter Customer Service dataset contains:
- Customer support conversations from Twitter
- Multiple brands and companies
- Text data for training customer service AI models
- Various conversation types and customer intents

## Usage in Code

The application is designed to work with or without the large dataset:
- If `twcs.csv` is present, it will be used for enhanced training
- If only `sample.csv` is available, the system will use the sample data
- The AI model can function with either dataset size
