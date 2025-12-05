import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react"
import useAdminAnnouncements, { Announcement, AnnouncementType } from "@/hooks/useAdminAnnouncements"
import { useToast } from "@/hooks/use-toast"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const AnnouncementManagement = () => {
    const [announcementType, setAnnouncementType] = useState<AnnouncementType>('team')
    const { announcements, isLoading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminAnnouncements(announcementType)
    const { toast } = useToast()

    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenDialog = (announcement?: Announcement) => {
        if (announcement) {
            setEditingAnnouncement(announcement)
            setFormData({
                name: announcement.name,
                description: announcement.description,
            })
        } else {
            setEditingAnnouncement(null)
            setFormData({
                name: '',
                description: '',
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        // Validate form
        if (!formData.name || formData.name.trim() === '') {
            toast({
                title: "Validation Error",
                description: "Please provide a title for the announcement",
                variant: "destructive",
            })
            return
        }

        if (!formData.description || formData.description.trim() === '' || formData.description === '<p><br></p>') {
            toast({
                title: "Validation Error",
                description: "Please provide a description for the announcement",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            if (editingAnnouncement) {
                await updateAnnouncement({ id: editingAnnouncement.id, data: formData })
                toast({
                    title: "Success",
                    description: "Announcement updated successfully",
                })
            } else {
                await createAnnouncement(formData)
                toast({
                    title: "Success",
                    description: "Announcement created successfully",
                })
            }
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to save announcement",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingAnnouncement) return
        try {
            await deleteAnnouncement(deletingAnnouncement.id)
            toast({
                title: "Success",
                description: "Announcement deleted successfully",
            })
            setIsDeleteDialogOpen(false)
            setDeletingAnnouncement(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to delete announcement",
                variant: "destructive",
            })
        }
    }

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link'],
            ['clean']
        ],
    }

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <CardTitle className="text-2xl font-bold">Announcement Management</CardTitle>
                                <div className="h-10 bg-gray-200 rounded animate-pulse w-[200px]"></div>
                            </div>
                            <Button disabled className="bg-[#2d4817] hover:bg-[#1f3210]">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Announcement
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search Skeleton */}
                        <div className="mb-4">
                            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>

                        {/* Table Skeleton */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Updated At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <CardTitle className="text-2xl font-bold">Announcement Management</CardTitle>
                            <Select value={announcementType} onValueChange={(value) => setAnnouncementType(value as AnnouncementType)}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="team">Team Announcements</SelectItem>
                                    <SelectItem value="jury">Jury Announcements</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-[#2d4817] hover:bg-[#1f3210]">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Announcement
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Updated At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAnnouncements.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                            No announcements found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAnnouncements.map((announcement) => (
                                        <TableRow key={announcement.id}>
                                            <TableCell className="font-medium">{announcement.name}</TableCell>
                                            <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(announcement.updated_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDialog(announcement)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setDeletingAnnouncement(announcement)
                                                            setIsDeleteDialogOpen(true)
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
                        <DialogDescription>
                            {editingAnnouncement ? 'Update announcement information' : 'Create a new announcement for teams and jury'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Title *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter announcement title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                modules={modules}
                                className="bg-white"
                                style={{ height: '200px', marginBottom: '50px' }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#2d4817] hover:bg-[#1f3210]"
                            disabled={isSubmitting || !formData.name || !formData.description || formData.description === '<p><br></p>'}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {editingAnnouncement ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>{editingAnnouncement ? 'Update' : 'Create'} Announcement</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AnnouncementManagement
