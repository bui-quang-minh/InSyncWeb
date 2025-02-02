"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table";
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox"
import { Loading } from "@/components/loading";
import { ConfirmModal } from "@/components/confirm-modal";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

type Project = {
  id: string;
  projectName: string;
  description: string;
  userId: string;
  userIdGuid: string;
  displayName: string;
  dateCreated: string;
  dateUpdated: string | null;
  isPublish: boolean;
};


const ProjectsPage = () => {

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { getToken } = useAuth();

  const fetchProjects = async () => {
    try {
      const jwt = await getToken({ template: "InSyncRoleToken" });
      if (!jwt) {
        throw new Error("Failed to retrieve JWT token.");
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/pagination`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
            Authorization: `Bearer ${jwt}`,
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, [isLoading]);

  const handleDelete = async (projectId: string) => {
    setIsLoading(true);
    try {
      const jwt = await getToken({ template: "InSyncRoleToken" });
      if (!jwt) {
        throw new Error("Failed to retrieve JWT token.");
      }
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
          Authorization: `Bearer ${jwt}`,
        }
      });
      toast.success("Project deleted successfully!");
      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
    },
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Project Name" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Created" />
      ),
      cell: ({ row }) => new Date(row.original.dateCreated).toLocaleString(),
    },
    {
      id: "actions",
      header: "Delete",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <div className="flex gap-2">
            <ConfirmModal
              header="Delete project?"
              description="This will delete the project and all of its contents."
              onConfirm={() => handleDelete(project.id)}
              disabled={isLoading}
            >
              <Button
                variant="redBg"
                size="sm"
                className="flex cursor-pointer text-sm w-full justify-center font-normal"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConfirmModal>

          </div >

        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <DataTable columns={columns} data={projects} />
    </div>
  );
};

export default ProjectsPage;