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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import useAdminJuries, { Jury } from "@/hooks/useAdminJuries"
import { useToast } from "@/hooks/use-toast"

const JuryManagement = () => {
    const { juries, isLoading, createJury, updateJury, deleteJury } = useAdminJuries()
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingJury, setEditingJury] = useState<Jury | null>(null)
    const [deletingJury, setDeletingJury] = useState<Jury | null>(null)
    const [formData, setFormData] = useState<Partial<Jury>>({
        name: '',
        user_name: '',
        email: '',
        password: '123',
        contact_number: '',
        address: '',
    })

    const filteredJuries = juries.filter(jury =>
        jury.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jury.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jury.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenDialog = (jury?: Jury) => {
        if (jury) {
            setEditingJury(jury)
            setFormData({
                name: jury.name,
                user_name: jury.user_name,
                email: jury.email,
                password: '', // Don't pre-fill password for security
                contact_number: jury.contact_number,
                address: jury.address,
            })
        } else {
            setEditingJury(null)
            setFormData({
                name: '',
                user_name: '',
                email: '',
                password: '123',
                contact_number: '',
                address: '',
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        try {
            // Remove password from update if it's empty
            const dataToSubmit = { ...formData }
            if (editingJury && !dataToSubmit.password) {
                delete dataToSubmit.password
            }

            if (editingJury) {
                await updateJury(editingJury.id, dataToSubmit)
                toast({
                    title: "Success",
                    description: "Jury updated successfully",
                })
            } else {
                await createJury(dataToSubmit)
                toast({
                    title: "Success",
                    description: "Jury created successfully",
                })
            }
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to save jury",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async () => {
        if (!deletingJury) return
        try {
            await deleteJury(deletingJury.id)
            toast({
                title: "Success",
                description: "Jury deleted successfully",
            })
            setIsDeleteDialogOpen(false)
            setDeletingJury(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to delete jury",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div className="p-6">Loading juries...</div>
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-2xl font-bold">Jury Management</CardTitle>
                        <Button onClick={() => handleOpenDialog()} className="bg-[#2d4817] hover:bg-[#1f3210]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Jury
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name, username, or email..."
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
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Contact Number</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJuries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">
                                            No juries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredJuries.map((jury) => (
                                        <TableRow key={jury.id}>
                                            <TableCell className="font-medium">{jury.name}</TableCell>
                                            <TableCell>{jury.user_name}</TableCell>
                                            <TableCell>{jury.email}</TableCell>
                                            <TableCell>{jury.contact_number || 'N/A'}</TableCell>
                                            <TableCell className="max-w-xs truncate">{jury.address || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDialog(jury)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setDeletingJury(jury)
                                                            setIsDeleteDialogOpen(true)
                                                        }}
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

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingJury ? 'Edit Jury' : 'Add New Jury'}</DialogTitle>
                        <DialogDescription>
                            {editingJury ? 'Update jury information' : 'Fill in the details to create a new jury member'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Username and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="user_name">Username *</Label>
                                <Input
                                    id="user_name"
                                    value={formData.user_name}
                                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                                    required
                                    disabled={!!editingJury} // Disable username editing
                                />
                                {editingJury && (
                                    <p className="text-xs text-gray-500">Username cannot be changed</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {editingJury ? '(leave empty to keep current)' : '*'}
                            </Label>
                            <Input
                                id="password"
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required={!editingJury}
                                placeholder={editingJury ? 'Leave empty to keep current password' : ''}
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <Input
                                id="contact_number"
                                value={formData.contact_number}
                                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="bg-[#2d4817] hover:bg-[#1f3210]">
                            {editingJury ? 'Update' : 'Create'} Jury
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
                            Are you sure you want to delete jury member "{deletingJury?.name}"? This action cannot be undone and will also delete their user account.
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

export default JuryManagement
