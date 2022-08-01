import express from "express";
import calculateBmi from "./src/calculateBmi";
import calculateExercises from "./src/calculateExercises";

const app = express();
app.use(express.json())

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (_req, res) => {
  const weight = Number(_req.query.weight);
  const height = Number(_req.query.height);

  if (!height || !weight) {
    res
      .json({
        error: "malformatted parameters",
      })
      .send()
      .end();
  } else if (typeof height !== "number" || typeof weight !== "number") {
    res
      .json({
        error: "malformatted parameters",
      })
      .send()
      .end();
  }

  const bmi = calculateBmi(height, weight);

  res
    .send({
      weight,
      height,
      bmi,
    })
    .end();
});

app.post("/exercises", (req, res) => {

  if(!req.body.dailyTarget || !req.body.dailyExcerciseHours){
    res.json({error: "parameters missing"}).end();
    return;
  }

  const dailyTarget = Number(req.body.dailyTarget)

  const dailyExerciseHours: number[] = [];

  if(!isNaN(dailyTarget)){
    req.body.dailyExerciseHours.forEach( (val:unknown) => {
      const hoursInNumber = Number(val);
      if (!isNaN(hoursInNumber)) {
        dailyExerciseHours.push(hoursInNumber);
      } else {
        res.json({error: "malformatted parameters"}).end();
        return
      }
    })
  }else{
    res.json({error: "malformatted parameters"}).end();
    return;
  }
  res.send(calculateExercises(dailyTarget, dailyExerciseHours)).end();
});

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
  const { value1, value2, op } = req.body;
  if ( !value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: '...'});
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});