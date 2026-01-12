export function parseTsv(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split("\t");

  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i];
    });

    obj.latitude = parseFloat(obj.latitude);
    obj.longitude = parseFloat(obj.longitude);
    obj.alt_temp_prob = parseFloat(obj.alt_temp_prob);

    return obj;
  });
}
