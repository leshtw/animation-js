///task 1
const moveTo = (
  fromCoords,
  toCoords,
  duration = 1000,
  freshRate = 144,
) => {
  const frameTime = Math.round(1000 / freshRate);
  const overallFrames = Math.ceil(duration / frameTime);
  const pathX = toCoords.x - fromCoords.x;
  const pathY = toCoords.y - fromCoords.y;
  const pathZ = toCoords.z - fromCoords.z;

  const frames = [{ time: 0, frameTime, x: fromCoords.x, y: fromCoords.y, z: fromCoords.z }];

  for (let step = 1; step < overallFrames; step++) {
    frames.push({
      time: frameTime * step,
      frameTime,
      x: fromCoords.x + pathX * (step / overallFrames),
      y: fromCoords.y + pathY * (step / overallFrames),
      z: fromCoords.z + pathZ * (step / overallFrames),
    });
  }
  return frames;
};
const moveToDynamicSpeed = (
  fromCoords,
  toCoords,
  duration = 1000,
  freshRate = 144,
) => {
  const frameTime = Math.round(1000 / freshRate); //время одного кадра
  const overallFrames = Math.ceil(duration / frameTime);//кол-во кадров
  const pathX = toCoords.x - fromCoords.x;
  const pathY = toCoords.y - fromCoords.y;
  const pathZ = toCoords.z - fromCoords.z;
  const speedPathX = pathX / overallFrames;//линейная скорость
  const speedPathY = pathY / overallFrames;
  const speedPathZ = pathZ / overallFrames;
  const frames = [{ time: 0, frameTime, x: fromCoords.x, y: fromCoords.y, z: fromCoords.z }];

  const delta = (percent) => percent < 50 ? percent * 2 - 50 : percent * -2 + 150;
  const final = (speed, delta) => speed + (speed * delta) / 100;

  for (let step = 1; step < overallFrames; step++) {
    const currentPercent = step / overallFrames * 100;//процент пройденных кадров
    const prevFrame = frames[step - 1];
    frames.push({
      time: frameTime * step,
      frameTime,
      x: parseFloat((prevFrame.x + final(speedPathX, delta(currentPercent))).toFixed(2)),
      y: parseFloat((prevFrame.y + final(speedPathY, delta(currentPercent))).toFixed(2)),
      z: parseFloat((prevFrame.z + final(speedPathZ, delta(currentPercent))).toFixed(2)),
    });
  }
  frames.push({ time: duration, frameTime, x: toCoords.x, y: toCoords.y, z: toCoords.z });
  return frames;
};
const goDegree = (
  fromDegree = 0,
  toDegree = 0,
  duration = 1000,
  freshRate = 30,
) => {
  const frameTime = Math.round(1000 / freshRate);
  const overallFrames = Math.ceil(duration / frameTime);
  const frames = [{ time: 0, frameTime, degree: fromDegree }];
  const pathDegree = toDegree - fromDegree;

  for (let step = 1; step < overallFrames; step++) {
    frames.push({
      time: frameTime * step,
      frameTime,

      degree: parseFloat((fromDegree + pathDegree * (step / overallFrames)).toFixed(2)),
    });
  }
  frames.push({ time: duration, frameTime, degree: toDegree });
  return frames;
};

///task 2

class IndexedMap {
  constructor () {
    this.collection = [];
  }

  set (key, value) {
    if (this.collection.find(item => item.key === key)) {
      this.collection.splice(this.collection.findIndex(item => item.key === key), 1, { key, value });
    } else {
      this.collection.push({ key, value });
    }
    return this;
  }

  setTo (index, value) {
    this.collection.splice(index, 0, value);
  }

  sort (fn) {
    return this.collection.sort((a, b) => {
      return fn(a.value, b.value, a.key, b.key);
    });
  }

  sortIndex (fn) {
    return this.collection.sort((a, b) => {
      return fn(this.collection.indexOf((a)), this.collection.indexOf(b));
    });
  }

  forEach (fn) {
    return this.collection.forEach((item) => fn(item.value, item.key, this.collection));
  }

  has (key) {
    return !!this.collection.find(item => item.key === key);
  }

  get (key) {
    if (!this.collection.find(item => item.key === key)) {
      return null;
    } else {
      return this.collection.find(item => item.key === key).value;
    }
  }

  remove (key) {
    const isset = this.collection.findIndex(item => key === item.key);
    if (isset < 0) this.collection.splice(isset, 1);

    return this;
  }

  removeAt (index, count = 1) {
    this.collection.splice(index, count);

    return this;
  }

  uniq () {
    return [...new Set(this.collection.map(item => item.value))];
  }

  union (...maps) {
    maps.forEach(item => item.forEach((value, key) => this.set(value, key)));

    return this;
  }
}
