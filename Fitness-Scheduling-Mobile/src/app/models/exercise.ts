export class Exercise{
    // Fields
    id: number;
    exerciseName:string;
    targetMuscle: string; // şimdilik sadece isim var knk. Sonradan o kas grubunun resmi de eklenecek.
    apparatus:string;
    exerciseInstructions: ExerciseInstructions;

    // Media
    vimeoVideo: string;
    animatedGif: string;
    thumbnailStillImage: string;
    highResStillImage: string;
    exerciseData:ExerciseData;
    exerciseStats: ExerciseStats;
    isDone:boolean;
}

class TargetMuscle{
    id: number;
    name: string;
    image: string;
}
class ExerciseInstructions{
    id: number;
    preparation: string;
    execution: string;
}
class ExerciseData{
    id: number;
    set: number;
    repeat: number[];
    time: number[];
    date: string;
}
class ExerciseStats{
    id:number;
    totalSet:number;
    totalRepeat:number;
    totalTime:number;
}
