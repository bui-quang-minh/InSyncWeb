"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table";
import { Eye, ListOrdered, LucidePencilRuler, MoreHorizontal, Pencil, Plus, Settings, SortAsc, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox"
import { Loading } from "@/components/loading";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/confirm-modal";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";

type Category = {
    id: string
    title: string
    order: number
    description: string | null
    dateCreated: string | null
    dateUpdated: string | null
    documents: Docs[] | null
}

type Docs = {
    id: string
    slug: string
    title: string
    content: string
    note: string
    dateCreated: string
    dateUpdated: string | null
    categoryId: string | null
    order: number
    categoryName: string | null
}

const AdminDocsCategoryPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [pageData, setPageData] = React.useState<Category | null>(null);
    const [docs, setDocs] = React.useState<Docs[] | null>(null);
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = React.useState<boolean>(false);
    const [editedCategoryTitle, setEditedCategoryTitle] = React.useState<string>("");
    const [editedCategoryOrder, setEditedCategoryOrder] = React.useState<number>(0);
    const [editedCategoryDescription, setEditedCategoryDescription] = React.useState<string>("");
    const [buttonCategoryDialogPending, setButtonCategoryDialogPending] = React.useState<boolean>(false);

    const [isEditDocumentId, setIsEditDocumentId] = React.useState<string>("");
    const [isEditDocumentDialogOpen, setIsEditDocumentDialogOpen] = React.useState<boolean>(false);
    const [editedDocumentTitle, setEditedDocumentTitle] = React.useState<string>("");
    const [editedDocumentSlug, setEditedDocumentSlug] = React.useState<string>("");
    const [editedDocumentOrder, setEditedDocumentOrder] = React.useState<number>(0);
    const [editedDocumentNote, setEditedDocumentNote] = React.useState<string>("");
    const [buttonDocumentDialogPending, setButtonDocumentDialogPending] = React.useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPageData(data);
                setDocs(data.documents);
                setEditedCategoryTitle(data.title);
                setEditedCategoryOrder(data.order);
                setEditedCategoryDescription(data.description);
            } else if (response.status === 404) {
                toast.error("Page not found");
                window.location.href = "/admin";
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const handleEditCategorySave = async (e: React.FormEvent) => {
        e.preventDefault();
        setButtonCategoryDialogPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editedCategoryTitle,
                    order: editedCategoryOrder,
                    description: editedCategoryDescription,
                    id: id,
                }),
            });
            if (response.ok) {
                toast.success("Category updated successfully");
                setIsEditCategoryDialogOpen(false);
                fetchData();
            } else {
                toast.error("Failed to update category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category");
        } finally {
            setButtonCategoryDialogPending(false);
        }
    }

    const handleDeleteCategory = async () => {
        setButtonCategoryDialogPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorydocument/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Category deleted successfully");
                setIsEditCategoryDialogOpen(false);
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 3000)
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        } finally {
            setButtonCategoryDialogPending(false);
        }
    }

    const handleEditDocumentSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setButtonDocumentDialogPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${isEditDocumentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: isEditDocumentId,
                    title: editedDocumentTitle,
                    slug: editedDocumentSlug,
                    order: editedDocumentOrder,
                    note: editedDocumentNote,
                    categoryId: id
                }),
            });
            if (response.ok) {
                toast.success("Document updated successfully");
                setIsEditDocumentDialogOpen(false);
                fetchData();
            } else {
                toast.error("Failed to update document");
            }
        } catch (error) {
            console.error("Error updating document:", error);
            toast.error("Failed to update document");
        } finally {
            setButtonDocumentDialogPending(false);
        }
    }

    const handleDeleteDocument = async () => {
        setButtonDocumentDialogPending(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${isEditDocumentId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Document deleted successfully");
                setIsEditDocumentDialogOpen(false);
                fetchData();
            } else {
                toast.error("Failed to delete document");
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Failed to delete document");
        } finally {
            setButtonDocumentDialogPending(false);
        }
    }

    const columns: ColumnDef<Docs>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Document Title" />
            ),
        },
        {
            accessorKey: "slug",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Slug" />
            ),
        },
        {
            accessorKey: "order",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Order" />
            ),
        },
        {
            accessorKey: "categoryName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Category" />
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
            header: () => (
                <div className="w-full flex justify-center">Action</div>
            ),
            cell: ({ row }) => {
                const document = row.original;

                return (
                    <div className="flex gap-2">
                        <Link href={`/docs/${document.slug}`} target="_blank" className="w-1/2">
                            <Button
                                className="w-full"
                                variant="ghost"
                                size="sm">
                                <Eye className="h-4 w-4 mr-2" /> View
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="w-1/2"
                                    variant="ghost"
                                    size="sm">
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link className="flex" href={`/admin/docs/${document.slug}`}>
                                        <LucidePencilRuler className="h-4 w-4 mr-2" /> Edit Content
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                    setIsEditDocumentId(document.id)
                                    setEditedDocumentTitle(document.title)
                                    setEditedDocumentSlug(document.slug)
                                    setEditedDocumentOrder(document.order)
                                    setEditedDocumentNote(document.note)
                                    setIsEditDocumentDialogOpen(true)
                                }}>
                                    <Settings className="h-4 w-4 mr-2" />Change Document Settings
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div >
                );
            },
        },
    ];

    if (loading) return <Loading />;
    if (!pageData) return <div className="text-center mt-4">Page not found</div>;
    if (!docs) return <div className="text-center mt-4">No documents found</div>;

    return (
        <div className="w-full h-full overflow-y-auto py-4">
            <div>
                <div className="flex justify-between">
                    <Button variant={"outline"} onClick={() => setIsEditCategoryDialogOpen(true)}><Settings className="h-4 w-4 mr-2" />Category Settings</Button>
                    <Button variant={"outline"} onClick={() => { }}><Plus className="h-4 w-4 mr-2" />Add Document</Button>
                </div>
                {/* Edit Dialog */}
                <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Documents Category Settings</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditCategorySave} className="py-4 gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    value={editedCategoryTitle}
                                    onChange={(e) => setEditedCategoryTitle(e.target.value)}
                                    className="col-span-3"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="order" className="text-right">Order</Label>
                                <Input
                                    type="number"
                                    id="order"
                                    value={editedCategoryOrder}
                                    onChange={(e) => setEditedCategoryOrder(Number(e.target.value))}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="order" className="text-right">Description</Label>
                                <Input
                                    type="text"
                                    id="description"
                                    value={editedCategoryDescription}
                                    onChange={(e) => setEditedCategoryDescription(e.target.value)}
                                    className="col-span-3"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <DialogFooter className="flex justify-center py-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <ConfirmModal
                                    header="Delete page?"
                                    description="This will delete the page and all of its contents."
                                    onConfirm={handleDeleteCategory}
                                >
                                    <Button
                                        variant="redBg"
                                        className="flex cursor-pointer text-sm justify-center font-normal"
                                        disabled={buttonCategoryDialogPending}
                                    >
                                        Delete
                                    </Button>
                                </ConfirmModal>
                                <Button type="submit" disabled={buttonCategoryDialogPending}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditDocumentDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Document Settings</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditDocumentSave} className="py-4 gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    value={editedDocumentTitle}
                                    onChange={(e) => setEditedDocumentTitle(e.target.value)}
                                    className="col-span-3"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="slug" className="text-right">Slug</Label>
                                <Input
                                    type="text"
                                    id="slug"
                                    value={editedDocumentSlug}
                                    onChange={(e) => setEditedDocumentSlug(e.target.value)}
                                    className="col-span-3"
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="order" className="text-right">Order</Label>
                                <Input
                                    type="number"
                                    id="order"
                                    value={editedDocumentOrder}
                                    onChange={(e) => setEditedDocumentOrder(Number(e.target.value))}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="note" className="text-right">Note</Label>
                                <Input
                                    id="order"
                                    value={editedDocumentNote}
                                    onChange={(e) => setEditedDocumentNote(e.target.value)}
                                    className="col-span-3"
                                    required
                                    minLength={2}
                                />
                            </div>

                            <DialogFooter className="flex justify-center py-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                                <ConfirmModal
                                    header="Delete page?"
                                    description="This will delete the page and all of its contents."
                                    onConfirm={handleDeleteDocument}
                                >
                                    <Button
                                        variant="redBg"
                                        className="flex cursor-pointer text-sm justify-center font-normal"
                                        disabled={buttonDocumentDialogPending}
                                    >
                                        Delete
                                    </Button>
                                </ConfirmModal>
                                <Button type="submit" disabled={buttonDocumentDialogPending}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={docs} />
        </div>
    );
}

export default AdminDocsCategoryPage;