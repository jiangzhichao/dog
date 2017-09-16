/**
 * Created by jiang on 2017/3/14.
 */
export function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

export function randomString() {
  let time = new Date().getTime();
  let suffix = Math.random().toString(36).substring(5);
  return `${time}-${suffix}`;
}
