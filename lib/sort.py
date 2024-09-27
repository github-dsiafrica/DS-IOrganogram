from numpy import NaN
import pandas as pd
from pandas.api.types import CategoricalDtype

# Read data
df = pd.read_csv('../public/data/data.csv')
print(df.head())

cat_role_order = CategoricalDtype(['Contact PI', 'MPI', 'PI', 'Co-PI', "Program Manager", 'Project Manager/Coordinator', 'Project Coordinator', 'Administrator', 'Administrative Assistant', 'Collaborator', 'Collaboration', 'Consultant', 'Co-Investigator', 'DMAC Lead/Member', 'Data Analyst', 'Data curator', 'Data Manager', 'Data scientist', 'eLwazi Uganda Node Bioinformatician/Data Scientist', 'Hub Deputy Director', "Master's student", 'Member and co-chair I-WG', 'Member/Collaborator', 'PhD Student', 'PhD Trainee', 'Post-Doc', 'Pre-Doc', 'Project Team Member', 'REDCap Administrator', 'REDCap Database Developer', 'Research Assistant', 'Research Fellow', 'Researcher', 'Sequencing', 'Site Investigator', 'Site PI', 'Software Developer', 'Software Engineer', 'System Admin | Data Scientist', 'Systems Administrator', 'Training and Outreach Coordinator', 'Training Coordinator', 'Web Developer', ''], ordered=True)

df['role'] = df['role'].astype(cat_role_order)
df.sort_values(["role", "title"])

# Save data
df.to_csv('../public/data/sorted_data.csv', index=False)