import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import xgboost as xgb

pd.options.display.float_format = '{:.3f}'.format
RND = 42
np.random.seed(RND)

# Load dataset
df = pd.read_csv("updated_wastewater_dataset.csv")
print("Rows, cols:", df.shape)

# Define reusability classes based on WHO/EPA guidelines for water reuse
def classify_reusability(row):
    bod = row['effluent_BOD']
    cod = row.get('effluent_COD', row['influent_COD'])  # Use influent_COD if effluent_COD not available
    tss = row['effluent_TSS']
    ph = row['effluent_pH']
    tds = row['influent_TDS']

    # Drinking or Fresh Water: Strictest standards
    if bod < 5 and cod < 10 and tss < 1 and 6.5 <= ph <= 8.5 and tds < 500:
        return 'drinking or fresh water'
    # Industrial High: High quality for sensitive industrial processes
    elif bod < 30 and cod < 75 and tss < 10 and 6 <= ph <= 9 and tds < 1000:
        return 'industrial_high'
    # Industrial Low: Lower quality for general industrial use
    elif bod < 100 and cod < 250 and tss < 50 and 6 <= ph <= 9 and tds < 2000:
        return 'industrial_low'
    # Cooling Tower: For cooling systems
    elif bod < 50 and cod < 150 and tss < 30 and 6.5 <= ph <= 8.5 and tds < 1500:
        return 'cooling_tower'
    # Toilet Flushing: For non-potable uses
    elif bod < 30 and cod < 100 and tss < 30 and 6 <= ph <= 9 and tds < 1000:
        return 'toilet_flushing'
    # Irrigation: For agricultural irrigation
    elif bod < 30 and cod < 100 and tss < 50 and 6 <= ph <= 9 and tds < 2000:
        return 'irrigation'
    # Agriculture: Similar to irrigation but slightly more lenient
    elif bod < 50 and cod < 150 and tss < 100 and 6 <= ph <= 9 and tds < 2000:
        return 'agriculture'
    # Landscaping: For landscape irrigation
    elif bod < 50 and cod < 150 and tss < 100 and 6 <= ph <= 9 and tds < 2000:
        return 'landscaping'
    # Construction: For construction site use
    elif bod < 100 and cod < 250 and tss < 100 and 6 <= ph <= 9 and tds < 2000:
        return 'construction'
    else:
        return 'not_reusable'

df['reusability'] = df.apply(classify_reusability, axis=1)
print("Reusability distribution:")
print(df['reusability'].value_counts())

# Basic cleaning
def basic_clean(df):
    df = df.copy()
    numeric_cols = [
        "influent_BOD","influent_COD","influent_TSS","influent_pH","influent_TDS",
        "flow_rate","aeration_rate","chemical_dose","sludge_recycle_rate","retention_time","temperature",
        "effluent_BOD","effluent_COD","effluent_TSS","effluent_pH"
    ]
    for c in numeric_cols:
        if c not in df.columns:
            df[c] = np.nan
    df = df.drop_duplicates().sort_values('timestamp').reset_index(drop=True)
    df[numeric_cols] = df[numeric_cols].interpolate(limit_direction='both', axis=0)
    return df

df = basic_clean(df)

# Feature engineering
def feature_engineer(df):
    df = df.copy()
    df['influent_BOD_roll24'] = df['influent_BOD'].rolling(window=24, min_periods=1).mean()
    df['dose_per_m3'] = df['chemical_dose'] / (df['flow_rate'].replace(0, np.nan))
    df['dose_per_m3'] = df['dose_per_m3'].fillna(0)
    df['effluent_BOD_lag1'] = df['effluent_BOD'].shift(1).fillna(method='bfill')
    df['hour'] = 12  # dummy
    df['dayofweek'] = 1  # dummy
    df['month'] = 6  # dummy
    return df

df = feature_engineer(df)

FEATURES = [
    "flow_rate", "influent_BOD", "influent_COD", "influent_TSS", "influent_pH", "influent_TDS",
    "aeration_rate", "chemical_dose", "sludge_recycle_rate", "retention_time", "temperature",
    "influent_BOD_roll24", "dose_per_m3", "effluent_BOD_lag1"
]
TARGET = "reusability"

for f in FEATURES:
    if f not in df.columns:
        df[f] = np.nan

df_model = df.dropna(subset=[TARGET]).reset_index(drop=True)
print("Rows available for modeling:", len(df_model))

# Train/test split
split_idx = int(len(df_model) * 0.8)
train_df = df_model.iloc[:split_idx].copy()
test_df = df_model.iloc[split_idx:].copy()
print("Train rows:", len(train_df), "Test rows:", len(test_df))

# Preprocessing
imputer = SimpleImputer(strategy='median')
scaler = StandardScaler()
label_encoder = LabelEncoder()

X_train_raw = train_df[FEATURES]
X_test_raw = test_df[FEATURES]

imputer.fit(X_train_raw)
X_train_imp = imputer.transform(X_train_raw)
X_test_imp = imputer.transform(X_test_raw)

scaler.fit(X_train_imp)
X_train = scaler.transform(X_train_imp)
X_test = scaler.transform(X_test_imp)

y_train_raw = train_df[TARGET]
y_test_raw = test_df[TARGET]
label_encoder.fit(y_train_raw)
y_train = label_encoder.transform(y_train_raw)
y_test = label_encoder.transform(y_test_raw)

print("Classes:", label_encoder.classes_)

# Train model
model = xgb.XGBClassifier(
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=RND,
    n_jobs=-1,
    objective='multi:softprob',
    num_class=len(label_encoder.classes_)
)

model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=50)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy:.3f}")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Save artifacts
ARTIFACT_DIR = "models_v1"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

joblib.dump(model, os.path.join(ARTIFACT_DIR, "model.joblib"))
joblib.dump(imputer, os.path.join(ARTIFACT_DIR, "imputer.joblib"))
joblib.dump(scaler, os.path.join(ARTIFACT_DIR, "scaler.joblib"))
joblib.dump(FEATURES, os.path.join(ARTIFACT_DIR, "features.joblib"))
joblib.dump(label_encoder, os.path.join(ARTIFACT_DIR, "label_encoder.joblib"))

meta = {
    "accuracy": float(accuracy),
    "train_rows": int(len(train_df)),
    "test_rows": int(len(test_df)),
    "classes": list(label_encoder.classes_),
    "trained_at": pd.Timestamp.now().isoformat()
}
joblib.dump(meta, os.path.join(ARTIFACT_DIR, "meta.joblib"))

print("Artifacts saved to", ARTIFACT_DIR)
