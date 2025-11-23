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
print("Columns:", df.columns.tolist())

# --- FIX: Handle missing effluent columns for classification ---
# If effluent_TSS or effluent_COD are missing from CSV, estimate them from influent values
# assuming typical treatment efficiency (e.g., 90% removal for TSS, 85% for COD)
if 'effluent_TSS' not in df.columns:
    print("⚠️ 'effluent_TSS' not found. Estimating from 'influent_TSS' (assuming 90% removal).")
    # If influent_TSS is also missing, use a default low value or 0
    if 'influent_TSS' in df.columns:
        df['effluent_TSS'] = df['influent_TSS'] * 0.1
    else:
        df['effluent_TSS'] = 0.0

if 'effluent_COD' not in df.columns:
    print("⚠️ 'effluent_COD' not found. Estimating from 'influent_COD' (assuming 85% removal).")
    if 'influent_COD' in df.columns:
        df['effluent_COD'] = df['influent_COD'] * 0.1
    else:
        df['effluent_COD'] = 0.0

if 'effluent_pH' not in df.columns:
    print("⚠️ 'effluent_pH' not found. Using 'influent_pH' as proxy.")
    if 'influent_pH' in df.columns:
        df['effluent_pH'] = df['influent_pH']
    else:
        df['effluent_pH'] = 7.0

# Define reusability classes based on WHO/EPA guidelines for water reuse
def classify_reusability(row):
    bod = row.get('effluent_BOD', 0) # Default to 0 if missing
    cod = row.get('effluent_COD', 0)
    tss = row.get('effluent_TSS', 0)
    ph = row.get('effluent_pH', 7)
    tds = row.get('influent_TDS', 0) # Using influent TDS as proxy if effluent TDS missing

    # Drinking or Fresh Water: Strictest standards
    if bod < 5 and cod < 10 and tss < 1 and 6.5 <= ph <= 8.5 and tds < 500:
        return 'drinking'
    # Industrial High: High quality for sensitive industrial processes
    elif bod < 30 and cod < 75 and tss < 5:
        return 'industrial_high'
    # Industrial Low: Cooling towers, washing, etc.
    elif bod < 50 and cod < 150 and tss < 20:
        return 'industrial_low'
    # Irrigation: Agriculture/Landscape
    elif bod < 100 and cod < 250 and tss < 50:
        return 'irrigation'
    # Not Reusable
    else:
        return 'not_reusable'

df['reusability_class'] = df.apply(classify_reusability, axis=1)
print("\nClass Distribution:\n", df['reusability_class'].value_counts())

# --- Feature Selection ---
# Use strictly the features available in input
features = [
    'flow_rate', 'influent_BOD', 'influent_COD', 'influent_TSS', 'influent_pH', 'influent_TDS',
    'aeration_rate', 'chemical_dose', 'sludge_recycle_rate', 'retention_time', 'temperature',
    'influent_BOD_roll24', 'dose_per_m3', 'effluent_BOD_lag1'
]

# Create derived features if they don't exist in CSV
if 'dose_per_m3' not in df.columns:
    # Avoid division by zero
    df['dose_per_m3'] = df.apply(lambda x: x['chemical_dose'] / x['flow_rate'] if x['flow_rate'] > 0 else 0, axis=1)

# For influent_BOD_roll24, if strictly not present, use influent_BOD
if 'influent_BOD_roll24' not in df.columns:
    if 'influent_BOD' in df.columns:
        df['influent_BOD_roll24'] = df['influent_BOD']
    else:
        df['influent_BOD_roll24'] = 0.0

X = df[features]
y = df['reusability_class']

# Split
X_train_raw, X_test_raw, y_train_raw, y_test_raw = train_test_split(X, y, test_size=0.2, random_state=RND)

# Preprocessing
imputer = SimpleImputer(strategy='median')
X_train_imp = imputer.fit_transform(X_train_raw)
X_test_imp = imputer.transform(X_test_raw)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train_imp)
X_test = scaler.transform(X_test_imp)

label_encoder = LabelEncoder()
y_train = label_encoder.fit_transform(y_train_raw)
y_test = label_encoder.transform(y_test_raw)

print("Classes:", label_encoder.classes_)

# Train model
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=RND,
    objective='multi:softprob',
    num_class=len(label_encoder.classes_)
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy:.3f}")

# Save artifacts
ARTIFACT_DIR = "models_v1"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

joblib.dump(model, os.path.join(ARTIFACT_DIR, "model.joblib"))
joblib.dump(imputer, os.path.join(ARTIFACT_DIR, "imputer.joblib"))
joblib.dump(scaler, os.path.join(ARTIFACT_DIR, "scaler.joblib"))
joblib.dump(label_encoder, os.path.join(ARTIFACT_DIR, "label_encoder.joblib"))
joblib.dump(features, os.path.join(ARTIFACT_DIR, "features.joblib"))

print("✅ Artifacts saved to", ARTIFACT_DIR)