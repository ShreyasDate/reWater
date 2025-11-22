import streamlit as st
import pandas as pd
import joblib
import os
import numpy as np
from datetime import datetime

ARTIFACT_DIR = "models_v1"

@st.cache_resource
def load_artifacts():
    # load all artifacts, fail loudly if missing so user can debug
    model = joblib.load(os.path.join(ARTIFACT_DIR, "model.joblib"))
    imputer = joblib.load(os.path.join(ARTIFACT_DIR, "imputer.joblib"))
    scaler = joblib.load(os.path.join(ARTIFACT_DIR, "scaler.joblib"))
    features = joblib.load(os.path.join(ARTIFACT_DIR, "features.joblib"))
    label_encoder = joblib.load(os.path.join(ARTIFACT_DIR, "label_encoder.joblib"))
    return model, imputer, scaler, features, label_encoder

def feature_engineer(df):
    """
    Expect a DataFrame with at least the raw input columns.
    Produces derived columns required by the model (if dataset had them).
    Works with single-row input too.
    """
    df = df.copy()

    # rolling 24-hour mean for influent_BOD:
    # If the input has a time-series index, use rolling; for single row fallback to the same value.
    if 'influent_BOD' in df.columns:
        try:
            # if multi-row with hourly index this will compute meaningful rolling mean
            df['influent_BOD_roll24'] = df['influent_BOD'].rolling(window=24, min_periods=1).mean()
            # For a single-row DataFrame this is just the same value
        except Exception:
            df['influent_BOD_roll24'] = df['influent_BOD'].astype(float)

    # normalized chemical dose per m3 (handle zero flow)
    if 'chemical_dose' in df.columns and 'flow_rate' in df.columns:
        flow = df['flow_rate'].replace(0, np.nan).astype(float)
        df['dose_per_m3'] = df['chemical_dose'].astype(float) / flow
        df['dose_per_m3'] = df['dose_per_m3'].fillna(0)

    # effluent_BOD_lag1: If user provided previous effluent BOD we keep it.
    # If there is an 'effluent_BOD' column and multiple rows, you might want to build lag.
    if 'effluent_BOD_lag1' not in df.columns and 'effluent_BOD' in df.columns:
        # create lag if more than one row, else set to current effluent_BOD
        if len(df) > 1:
            df['effluent_BOD_lag1'] = df['effluent_BOD'].shift(1).bfill()
        else:
            df['effluent_BOD_lag1'] = df['effluent_BOD']

    # time features: use current system time so the model can pick up hour/day/month if trained with them
    now = datetime.now()
    df['hour'] = now.hour
    df['dayofweek'] = now.weekday()
    df['month'] = now.month

    # ensure numeric dtype where applicable
    for col in df.columns:
        # attempt convert to numeric for model compatibility
        try:
            df[col] = pd.to_numeric(df[col])
        except Exception:
            pass

    return df

def preprocess_df_for_model(df_in, imputer, scaler, features):
    """
    Build X matrix matching the saved 'features' order.
    - Ensures all features exist (fills NaN for missing)
    - Applies imputer and scaler in order
    - Returns numpy array ready for model.predict / predict_proba
    """
    # create DataFrame with columns equal to features in the same order
    X = pd.DataFrame(columns=features)
    # copy values where available
    for c in features:
        if c in df_in.columns:
            X[c] = df_in[c]
        else:
            X[c] = np.nan

    # imputer expects 2D array-like; if imputer was fit on DataFrame column order, this preserves it
    X_imp = imputer.transform(X.values)
    X_scaled = scaler.transform(X_imp)
    return X_scaled

# --- Main App ---
st.set_page_config(page_title="Wastewater Reusability Predictor", layout="wide")
st.title("Wastewater Reusability Predictor")
st.write("Predict if treated wastewater is reusable and for what purpose based on effluent quality parameters.")

# load artifacts
try:
    model, imputer, scaler, features, label_encoder = load_artifacts()
except Exception as e:
    st.error(f"Failed to load model artifacts from '{ARTIFACT_DIR}'. Check that model.joblib, imputer.joblib, scaler.joblib, features.joblib and label_encoder.joblib exist.\n\nError: {e}")
    st.stop()

# Input form for parameters (use columns for tidy layout)
with st.form(key="input_form"):
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        flow_rate = st.text_input("Flow Rate (m³/h)", value="500")
        influent_bod = st.text_input("Influent BOD (mg/L)", value="200")
        influent_cod = st.text_input("Influent COD (mg/L)", value="400")
        influent_tss = st.text_input("Influent TSS (mg/L)", value="150")
    with col2:
        influent_ph = st.text_input("Influent pH", value="7.0")
        influent_tds = st.text_input("Influent TDS (mg/L)", value="800")
        aeration_rate = st.text_input("Aeration Rate (m³/h)", value="3")
        chemical_dose = st.text_input("Chemical Dose (mg/L)", value="5")
    with col3:
        sludge_recycle_rate = st.text_input("Sludge Recycle Rate (%)", value="25")
        retention_time = st.text_input("Retention Time (hours)", value="5")
        temperature = st.text_input("Temperature (°C)", value="25")
        effluent_bod = st.text_input("Current Effluent BOD (mg/L)", value="5")
    with col4:
        effluent_bod_lag1 = st.text_input("Previous Effluent BOD (mg/L)", value="6")
        effluent_cod = st.text_input("Effluent COD (mg/L)", value="10")
        effluent_tss = st.text_input("Effluent TSS (mg/L)", value="5")
        effluent_tds = st.text_input("Effluent TDS (mg/L)", value="300")

    submit = st.form_submit_button("Predict Reusability")

if submit:
    # validate and build input dataframe
    try:
        input_data = {
            "flow_rate": float(flow_rate),
            "influent_BOD": float(influent_bod),
            "influent_COD": float(influent_cod),
            "influent_TSS": float(influent_tss),
            "influent_pH": float(influent_ph),
            "influent_TDS": float(influent_tds),
            "aeration_rate": float(aeration_rate),
            "chemical_dose": float(chemical_dose),
            "sludge_recycle_rate": float(sludge_recycle_rate),
            "retention_time": float(retention_time),
            "temperature": float(temperature),
            "effluent_BOD": float(effluent_bod),
            "effluent_BOD_lag1": float(effluent_bod_lag1),
            "effluent_COD": float(effluent_cod),
            "effluent_TSS": float(effluent_tss),
            "effluent_TDS": float(effluent_tds)
        }
        input_df = pd.DataFrame([input_data])
    except ValueError:
        st.error("Please enter valid numeric values for all parameters.")
        st.stop()

    # Feature engineering
    input_df = feature_engineer(input_df)

    # Preprocess to match model features order
    X = preprocess_df_for_model(input_df, imputer, scaler, features)

    # Predictions
    pred_encoded = model.predict(X)[0]
    try:
        pred_label = label_encoder.inverse_transform([pred_encoded])[0]
    except Exception:
        # In case label encoder works with classes_ mapping differently
        if hasattr(label_encoder, "classes_"):
            classes = list(label_encoder.classes_)
            pred_label = classes[int(pred_encoded)]
        else:
            pred_label = str(pred_encoded)

    st.success(f"Predicted Reusability: **{pred_label}**")

    # Full probability table for all classes
    probs = model.predict_proba(X)[0]

    # Build DataFrame using label_encoder.classes_ to preserve mapping
    class_names = list(label_encoder.classes_)
    prob_values = (probs * 100).round(2)

    prob_df = pd.DataFrame({
        "Class": class_names,
        "Probability (%)": prob_values
    })

    # Sort descending by probability (optional - improves readability)
    prob_df = prob_df.sort_values(by="Probability (%)", ascending=False).reset_index(drop=True)

    st.subheader("Reusability Class Probabilities (all classes)")
    st.dataframe(prob_df, use_container_width=True)

    # Optional: show a simple bar chart for top N classes
    top_n = min(8, len(prob_df))
    st.subheader(f"Top {top_n} Predictions")
    st.bar_chart(prob_df.head(top_n).set_index("Class"))

    # Optional: display brief description for each class if you have mapping
    # Example mapping (edit these descriptions to match your label meanings)
    class_descriptions = {
        "drinking": "Treated to potable/drinking standards.",
        "toilet_flushing": "Safe for non-potable indoor use (toilet flushing).",
        "cooling_tower": "Suitable for cooling tower make-up water.",
        "industrial": "Suitable for general industrial processes.",
        "industrial_high": "High-quality industrial reuse (sensitive processes).",
        "irrigation": "Safe for irrigation (may have agricultural restrictions).",
        "landscaping": "Suitable for parks and landscaping.",
        "construction": "Suitable for construction uses (e.g., concrete mixing).",
        "not_reusable": "Not suitable for reuse – requires further treatment or disposal."
    }

    # show descriptions for classes present in model
    present_desc = {c: class_descriptions.get(c, "") for c in class_names}
    desc_df = pd.DataFrame.from_dict(present_desc, orient="index", columns=["Description"])
    desc_df.index.name = "Class"
    st.subheader("Class Descriptions (if available)")
    st.table(desc_df)