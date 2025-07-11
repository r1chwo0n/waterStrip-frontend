export function dmsToDecimal(dms: string): number {
  // รองรับรูปแบบ DMS เช่น 13°45'30" N หรือ 13°45'30.5"N (มีหรือไม่มีช่องว่างก็ได้)
  const regex = /(\d+)[°]\s*(\d+)'(\d+(?:\.\d+)?)"\s*([NSEW])/i;
  const match = dms.match(regex);
  if (!match) throw new Error(`Invalid DMS format: ${dms}`);

  const degrees = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseFloat(match[3]);
  const direction = match[4].toUpperCase();

  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (direction === "S" || direction === "W") {
    decimal = -decimal;
  }
  return decimal;
}
