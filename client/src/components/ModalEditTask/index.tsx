import Modal from "@/components/Modal";
import {
  Priority,
  Status,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/state/api";
import React, { useEffect, useState } from "react";
import { format, formatISO } from "date-fns";
import { Task as TaskType } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  taskDetails?: TaskType;
};

const ModalEditTask = ({ isOpen, onClose, taskDetails }: Props) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (isOpen && taskDetails) {
      // Set values from taskDetails if editing an existing task
      setTitle(taskDetails.title || "");
      setDescription(taskDetails.description || "");
      setStatus(taskDetails.status || Status.ToDo);
      setPriority(taskDetails.priority || Priority.Backlog);
      setTags(taskDetails.tags || "");
      setStartDate(
        taskDetails.startDate
          ? format(new Date(taskDetails.startDate), "yyyy-MM-dd")
          : "",
      );
      setDueDate(
        taskDetails.dueDate
          ? format(new Date(taskDetails.dueDate), "yyyy-MM-dd")
          : "",
      );
      setAssignedUserId(taskDetails.assignedUserId?.toString() || "");
      setProjectId(taskDetails.projectId?.toString() || "");
    }
  }, [isOpen, taskDetails]);

  console.log("task id", taskDetails?.id);

  const handleSubmit = async () => {
    if (!title || !taskDetails?.id) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    try {
      await updateTask({
        id: taskDetails.id,
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        projectId: projectId ? parseInt(projectId) : undefined,
        assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
      }).unwrap();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  // const isFormValid = () => {
  //   return title && !(taskDetails?.id !== null || projectId);
  // };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {taskDetails?.id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600`}
          // disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditTask;
