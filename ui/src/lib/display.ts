export const WAD = BigInt("1000000000000000000");
export const RAY = BigInt("1000000000000000000000000000");

export function formatStringToDecimal(num: string): string {
  const decimal = num.slice(num.length-2);
  const integer = num.slice(0, num.length-2);
  return `${integer}.${decimal}`;
}

export function formatWadToDecimal(wad: BigInt, decimalPlaces = 2): string {
  const decimal = wad.valueOf() % WAD;
  const integer = wad.valueOf() / WAD;

  return `${integer}.${decimal.toString().slice(0,decimalPlaces)}`;
}

export function formatRayToDecimal(ray: BigInt, decimalPlaces = 1): string {
  const decimal = ray.valueOf() % RAY;
  const integer = ray.valueOf() / RAY;

  return `${integer}.${decimal.toString().slice(0,decimalPlaces)}`;
}

export function formatTimestampToString(timestamp: BigInt): string {
  const timestamp_ = parseInt(timestamp.toString());
  const days = Math.floor(timestamp_ / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timestamp_ / (1000 * 60 * 60));
  const minutes = Math.floor(timestamp_ / (1000 * 60));

  if ( days != 0 ) {
    if ( days == 1 ) return '1 day';
    return `${days} days`;
  } 
  
  if ( hours == 0 ) {
    if ( minutes == 0 ) return `<1 minute`;
    if ( minutes == 1 ) return `1 minute`;
    return `${minutes} minutes`;
  } else {
    if ( hours == 1 ) return `1 hour`;
    return `${hours} hours`;
  }
}

export function formatDoubleDigits(num: number) {
  if ( num < 10 ) return `0${num}`;
  else return num.toString();
}