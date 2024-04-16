import { SubtaskDto } from "../Dtos/SubtaskDto";
import { ISubtask, SubtaskMap } from "../Interfaces/ISubtask";

/**
 * Generate a Map of SubtaskDtos with the corresponding taskId as the key
 * @param {ISubtask[]} subtasks
 * @returns 
 */
export const buildSubtaskMap = (subtasks:ISubtask[]) => {
    return subtasks.reduce(
        (acc: SubtaskMap, subtask) => {
          if (!subtask.task) return acc;
          const taskId: string = subtask.task.toString();
          if (!acc[taskId]) {
            acc[taskId] = [];
          }
          acc[taskId].push(
            new SubtaskDto(
              subtask._id.toString(),
              subtask.title,
              subtask.isCompleted,
              taskId
            )
          );

          return acc;
        },
        {}
      );
}