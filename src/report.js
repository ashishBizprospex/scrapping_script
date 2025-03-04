const fs = require('fs');
const { fetchAllData } = require('./saveData');

async function generateReport() {
    const oldDataFile = './reports/old_data.json';
    const newData = await fetchAllData();

    let oldData = [];

    if (fs.existsSync(oldDataFile)) {
        oldData = JSON.parse(fs.readFileSync(oldDataFile, 'utf8'));
    }

    const oldNames = oldData.map(d => d.name);
    const newNames = newData.map(d => d.name);

    const addedData = newNames.filter(name => !oldNames.includes(name));
    const removedData = oldNames.filter(name => !newNames.includes(name));

    const reportContent = `
📅 Report Generated: ${new Date().toLocaleString()}

📊 Data Summary:
- Total Old Data Count: ${oldNames.length}
- Total New Data Count: ${newNames.length}
- New Entries Added: ${addedData.length}
- Entries Removed: ${removedData.length}

🆕 Added Data:
${addedData.length > 0 ? addedData.join('\n') : 'None'}

❌ Removed Data:
${removedData.length > 0 ? removedData.join('\n') : 'None'}

------------------------------------------------------
`;

    fs.writeFileSync('./reports/final_report.txt', reportContent);
    console.log("📄 Report saved: ./reports/final_report.txt");

    fs.writeFileSync(oldDataFile, JSON.stringify(newData, null, 2));
}

// ✅ Export the function
module.exports = { generateReport };
