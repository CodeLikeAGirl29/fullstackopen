interface exerciseValues {
  dailyTarget: number;
  dailyExcerciseHours: number[];
}

const calculateExercises = (
  dailyTarget: number,
  dailyExcerciseHours: number[]
) => {
  const trainingDays = dailyExcerciseHours.filter(
    (exerciseHour) => exerciseHour !== 0
  );

  return {
    periodLength: dailyExcerciseHours.length,
    trainingDays: trainingDays.length,
    success: false,
    rating: 2,
    ratingDescription: "not too bad but could be better",
    target: dailyTarget,
    average:
      dailyExcerciseHours.reduce((total, curr) => curr + total, 0) /
      dailyExcerciseHours.length,
  };
};

const parseArguments = (args: string[]): exerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (!isNaN(Number(args[2]))) {
    const dailyExcerciseHours: number[] = [];
    args.slice(3).forEach((val) => {
      const hoursInNumber = Number(val);
      if (!isNaN(hoursInNumber)) {
        dailyExcerciseHours.push(hoursInNumber);
      } else {
        throw new Error("Provided dailyExcerciseHours were not numbers!" + val);
      }
    });

    return {
      dailyTarget: Number(args[2]),
      dailyExcerciseHours: dailyExcerciseHours,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  const { dailyTarget, dailyExcerciseHours } = parseArguments(process.argv);
  console.log(calculateExercises(dailyTarget, dailyExcerciseHours));
} catch (error) {
  if (error instanceof Error) console.log(error.message);
}

export default calculateExercises;