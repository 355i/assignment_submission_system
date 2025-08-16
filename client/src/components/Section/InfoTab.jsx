import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ClipboardCheck,
  Download,
  FileText,
  Pencil,
  Calendar,
  Clock,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function InfoTab({
  assignment,
  editAssignment,
  setEditAssignment,
  isEditing,
  setIsEditing,
  handleSave,
}) {
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const dt = new Date(dateStr);
    return dt.toLocaleString();
  };

  const faqInputRef = useRef(null);
  const detailInputRef = useRef(null);

  const startEditing = () => {
    setEditAssignment({
      title: assignment.title || "",
      description: assignment.description || "",
      rubric: assignment.rubric || "",
      releaseDate: assignment.releaseDate || "",
      dueDate: assignment.dueDate || "",
      faqFile: null,
      detailFile: null,
    });
    setIsEditing(true);
  };

  async function downloadAssignmentFile(assignmentId, fileType) {
    const token = localStorage.getItem("token");
    const url = `http://localhost:1000/assignment/${assignmentId}/download?file=${fileType}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch (_) { }
        throw new Error(
          `Download failed: ${response.status} ${response.statusText} ${errorText}`
        );
      }

      const blob = await response.blob();

      const disposition = response.headers.get("Content-Disposition");
      let filename = "file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/"/g, "");
      }

      const link = document.createElement("a");
      const blobUrl = window.URL.createObjectURL(blob);
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download error:", e);
      alert(`Download error: ${e.message}\n\nSee console for details.`);
    }
  }

  return (
    <div className="space-y-8 p-4">
      {/* Title */}
      <div className="border-b pb-4">
        {isEditing ? (
          <Input
            className="text-3xl font-extrabold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
            value={editAssignment?.title ?? ""}
            onChange={(e) =>
              setEditAssignment((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Untitled Assignment"
          />
        ) : (
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {assignment?.title || "Untitled"}
          </h1>
        )}

        <div className="mt-3 flex flex-wrap gap-6 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {isEditing ? (
              <Input
                type="datetime-local"
                className="border rounded px-2 py-1 text-sm"
                value={editAssignment?.releaseDate?.slice(0, 16) ?? ""}
                onChange={(e) =>
                  setEditAssignment((prev) => ({
                    ...prev,
                    releaseDate: e.target.value,
                  }))
                }
              />
            ) : (
              <span>Release Date: {formatDateTime(assignment?.releaseDate)}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {isEditing ? (
              <Input
                type="datetime-local"
                className="border rounded px-2 py-1 text-sm"
                value={editAssignment?.dueDate?.slice(0, 16) ?? ""}
                onChange={(e) =>
                  setEditAssignment((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
              />
            ) : (
              <span>Due Date: {formatDateTime(assignment?.dueDate)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-600 mb-2">
          <BookOpen className="h-5 w-5" />
          Description
        </h2>
        {isEditing ? (
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            value={editAssignment?.description ?? ""}
            onChange={(e) =>
              setEditAssignment((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        ) : (
          <p className="whitespace-pre-wrap text-gray-700">
            {assignment?.description || "No description."}
          </p>
        )}
      </div>

      {/* Rubric */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600 mb-2">
          <ClipboardCheck className="h-5 w-5" />
          Rubric
        </h2>
        {isEditing ? (
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={4}
            value={editAssignment?.rubric ?? ""}
            onChange={(e) =>
              setEditAssignment((prev) => ({ ...prev, rubric: e.target.value }))
            }
          />
        ) : (
          <pre className="bg-gray-50 text-sm text-gray-800 p-4 rounded-lg border whitespace-pre-wrap">
            {assignment?.rubric || "No rubric."}
          </pre>
        )}
      </div>

      {/* Upload FAQ & Detail */}
      {isEditing && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <label className="block text-lg font-medium mb-2">Upload FAQ (.csv)</label>
            <div className="flex items-center gap-4">
              <Upload className="w-5 h-5 text-blue-500" />
              <button
                type="button"
                onClick={() => faqInputRef.current?.click()}
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full"
              >
                Choose File
              </button>
              <input
                type="file"
                accept=".csv"
                ref={faqInputRef}
                onChange={(e) =>
                  setEditAssignment((prev) => ({ ...prev, faqFile: e.target.files?.[0] }))
                }
                className="hidden"
              />
            </div>
            {assignment?.faqPath && (
              <p className="mt-2 text-sm text-gray-600">
                Old file exists, uploading new file will replace it.
              </p>
            )}
            {editAssignment?.faqFile && (
              <p className="text-sm mt-2 text-gray-600">Selected: {editAssignment.faqFile.name}</p>
            )}
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
            <label className="block text-lg font-medium mb-2">Upload Detail (.pdf)</label>
            <div className="flex items-center gap-4">
              <Upload className="w-5 h-5 text-purple-500" />
              <button
                type="button"
                onClick={() => detailInputRef.current?.click()}
                className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full"
              >
                Choose File
              </button>
              <input
                type="file"
                accept="application/pdf"
                ref={detailInputRef}
                onChange={(e) =>
                  setEditAssignment((prev) => ({ ...prev, detailFile: e.target.files?.[0] }))
                }
                className="hidden"
              />
            </div>
            {assignment?.detailPath && (
              <p className="mt-2 text-sm text-gray-600">
                Old file exists, uploading new file will replace it.
              </p>
            )}
            {editAssignment?.detailFile && (
              <p className="text-sm mt-2 text-gray-600">Selected: {editAssignment.detailFile.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Download */}
      {assignment?.hasDetail && !isEditing && (
        <div>
          <Button
            variant="outline"
            className="hover:bg-gray-100"
            onClick={() => downloadAssignmentFile(assignment.id, "detail")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      )}

      {/* Buttons */}
      {assignment?.canEdit && (
        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleSave()}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditAssignment((prev) => ({
                    ...prev,
                    faqFile: null,
                    detailFile: null,
                  }));
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={startEditing}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
