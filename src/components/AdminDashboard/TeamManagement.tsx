import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Edit, Trash2, Search, Eye, X, FileText, Loader2 } from "lucide-react"
import useAdminTeams, { Team } from "@/hooks/useAdminTeams"
import useAdminJuries from "@/hooks/useAdminJuries"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

interface Memorial {
    id: number
    moot_problem: string
    created_at: string
    file: any
}

const ROUND_CHOICES = [
    { value: 'Memorial', label: 'Memorial' },
    { value: 'Prelims', label: 'Prelims' },
    { value: 'Quarter-Finals', label: 'Quarter Finals' },
    { value: 'Semi-Finals', label: 'Semi-Finals' },
    { value: 'Final', label: 'Final' },
]

const COURSE_TYPES = [
    { value: '3yr_llb', label: '3 yr LL.B' },
    { value: '5yr_llb', label: '5 yr LL.B' },
]

const TeamManagement = () => {
    const { teams, isLoading, createTeam, updateTeam, deleteTeam } = useAdminTeams()
    const { juries } = useAdminJuries()
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [editingTeam, setEditingTeam] = useState<Team | null>(null)
    const [deletingTeam, setDeletingTeam] = useState<Team | null>(null)
    const [viewingTeam, setViewingTeam] = useState<Team | null>(null)
    const [teamMemorials, setTeamMemorials] = useState<Memorial[]>([])
    const [loadingMemorials, setLoadingMemorials] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<Partial<Team>>({
        current_round: 'Memorial',
        team_representative_name: '',
        team_representative_email: '',
        speaker_1_name: '',
        speaker_1_course_type: '3yr_llb',
        speaker_1_email: '',
        speaker_1_contact_number: '',
        speaker_2_name: '',
        speaker_2_course_type: '3yr_llb',
        researcher_name: '',
        institution_name: '',
        class_teacher_name: '',
        class_teacher_contact_number: '',
        user_password: '123',
        is_active: true,
    })

    const filteredTeams = teams.filter(team =>
        team.team_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team_representative_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.institution_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Validation function to check if all required fields are filled
    const validateForm = () => {
        const requiredFields = [
            { field: 'team_representative_name', label: 'Team Representative Name' },
            { field: 'team_representative_email', label: 'Representative Email' },
            { field: 'speaker_1_name', label: 'Speaker 1 Name' },
            { field: 'speaker_1_email', label: 'Speaker 1 Email' },
            { field: 'speaker_1_course_type', label: 'Speaker 1 Course Type' },
            { field: 'speaker_1_contact_number', label: 'Speaker 1 Contact' },
            { field: 'speaker_2_name', label: 'Speaker 2 Name' },
            { field: 'speaker_2_course_type', label: 'Speaker 2 Course Type' },
            { field: 'researcher_name', label: 'Researcher Name' },
            { field: 'institution_name', label: 'Institution Name' },
            { field: 'class_teacher_name', label: 'Class Teacher Name' },
            { field: 'class_teacher_contact_number', label: 'Teacher Contact' },
            { field: 'current_round', label: 'Current Round' },
            { field: 'user_password', label: 'Password' },
        ]

        const missingFields = requiredFields.filter(
            ({ field }) => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === ''
        )

        return missingFields
    }

    const isFormValid = validateForm().length === 0

    const handleOpenDialog = (team?: Team) => {
        if (team) {
            setEditingTeam(team)
            setFormData(team)
        } else {
            setEditingTeam(null)
            setFormData({
                current_round: 'Memorial',
                team_representative_name: '',
                team_representative_email: '',
                speaker_1_name: '',
                speaker_1_course_type: '3yr_llb',
                speaker_1_email: '',
                speaker_1_contact_number: '',
                speaker_2_name: '',
                speaker_2_course_type: '3yr_llb',
                researcher_name: '',
                institution_name: '',
                class_teacher_name: '',
                class_teacher_contact_number: '',
                user_password: '123',
                is_active: true,
            })
        }
        setIsDialogOpen(true)
    }

    const handleViewDetails = async (team: Team) => {
        setViewingTeam(team)
        setIsDetailsOpen(true)

        // Fetch team memorials
        setLoadingMemorials(true)
        try {
            const token = localStorage.getItem('access_token')
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/memorials/?team=${team.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setTeamMemorials(response.data)
        } catch (error) {
            console.error('Error fetching memorials:', error)
            setTeamMemorials([])
        } finally {
            setLoadingMemorials(false)
        }
    }

    const handleToggleActive = async (team: Team) => {
        try {
            await updateTeam(team.id, { is_active: !team.is_active })
            toast({
                title: "Success",
                description: `Team ${team.is_active ? 'deactivated' : 'activated'} successfully`,
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to update team status",
                variant: "destructive",
            })
        }
    }

    const handleSubmit = async () => {
        // Validate form before submission
        const missingFields = validateForm()
        if (missingFields.length > 0) {
            toast({
                title: "Validation Error",
                description: `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`,
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            if (editingTeam) {
                await updateTeam(editingTeam.id, formData)
                toast({
                    title: "Success",
                    description: "Team updated successfully",
                })
            } else {
                await createTeam(formData)
                toast({
                    title: "Success",
                    description: "Team created successfully",
                })
            }
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to save team",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingTeam) return
        try {
            await deleteTeam(deletingTeam.id)
            toast({
                title: "Success",
                description: "Team deleted successfully",
            })
            setIsDeleteDialogOpen(false)
            setDeletingTeam(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to delete team",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
                            <Button disabled className="bg-[#2d4817] hover:bg-[#1f3210]">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Team
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
                                        <TableHead>Team ID</TableHead>
                                        <TableHead>Representative</TableHead>
                                        <TableHead>Institution</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24"></div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
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
                        <CardTitle className="text-2xl font-bold">Team Management</CardTitle>
                        <Button onClick={() => handleOpenDialog()} className="bg-[#2d4817] hover:bg-[#1f3210]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Team
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by team ID, representative name, or institution..."
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
                                    <TableHead>Team ID</TableHead>
                                    <TableHead>Representative</TableHead>
                                    <TableHead>Institution</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeams.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500">
                                            No teams found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTeams.map((team) => (
                                        <TableRow key={team.id}>
                                            <TableCell className="font-medium">{team.team_id}</TableCell>
                                            <TableCell>{team.team_representative_name}</TableCell>
                                            <TableCell>{team.institution_name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={team.is_active}
                                                        onCheckedChange={() => handleToggleActive(team)}
                                                    />
                                                    <span className={`text-xs ${team.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                        {team.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(team)}
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDialog(team)}
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setDeletingTeam(team)
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

            {/* Team Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Team Details - {viewingTeam?.team_id}</DialogTitle>
                    </DialogHeader>
                    {viewingTeam && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600">Team ID</Label>
                                    <p className="mt-1">{viewingTeam.team_id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600">Current Round</Label>
                                    <p className="mt-1">{ROUND_CHOICES.find(r => r.value === viewingTeam.current_round)?.label || viewingTeam.current_round}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Team Representative</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Name</Label>
                                        <p className="mt-1">{viewingTeam.team_representative_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Email</Label>
                                        <p className="mt-1">{viewingTeam.team_representative_email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Speaker 1</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Name</Label>
                                        <p className="mt-1">{viewingTeam.speaker_1_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Email</Label>
                                        <p className="mt-1">{viewingTeam.speaker_1_email}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Course Type</Label>
                                        <p className="mt-1">{COURSE_TYPES.find(t => t.value === viewingTeam.speaker_1_course_type)?.label}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Contact</Label>
                                        <p className="mt-1">{viewingTeam.speaker_1_contact_number}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Speaker 2</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Name</Label>
                                        <p className="mt-1">{viewingTeam.speaker_2_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Course Type</Label>
                                        <p className="mt-1">{COURSE_TYPES.find(t => t.value === viewingTeam.speaker_2_course_type)?.label}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Researcher</h3>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-600">Name</Label>
                                    <p className="mt-1">{viewingTeam.researcher_name}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Institution Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Institution Name</Label>
                                        <p className="mt-1">{viewingTeam.institution_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Class Teacher</Label>
                                        <p className="mt-1">{viewingTeam.class_teacher_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Teacher Contact</Label>
                                        <p className="mt-1">{viewingTeam.class_teacher_contact_number}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3">Assignment</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Assigned Jury</Label>
                                        <p className="mt-1">{viewingTeam.jury_details?.name || 'Not Assigned'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Status</Label>
                                        <p className="mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs ${viewingTeam.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {viewingTeam.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Memorials Submitted
                                </h3>
                                {loadingMemorials ? (
                                    <p className="text-sm text-gray-500">Loading memorials...</p>
                                ) : teamMemorials.length === 0 ? (
                                    <p className="text-sm text-gray-500">No memorials submitted yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {teamMemorials.map((memorial) => (
                                            <div key={memorial.id} className="bg-gray-50 p-3 rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">
                                                            {memorial.moot_problem || 'Not Specified'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Submitted: {new Date(memorial.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    {memorial.file && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(`${import.meta.env.VITE_API_URL}${memorial.file}`, '_blank')}
                                                            className="ml-2"
                                                        >
                                                            <FileText className="h-3 w-3 mr-1" />
                                                            View File
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingTeam ? 'Edit Team' : 'Add New Team'}</DialogTitle>
                        <DialogDescription>
                            {editingTeam ? 'Update team information' : 'Fill in the details to create a new team'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Team Representative */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="team_representative_name">Team Representative Name *</Label>
                                <Input
                                    id="team_representative_name"
                                    value={formData.team_representative_name}
                                    onChange={(e) => setFormData({ ...formData, team_representative_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="team_representative_email">Representative Email *</Label>
                                <Input
                                    id="team_representative_email"
                                    type="email"
                                    value={formData.team_representative_email}
                                    onChange={(e) => setFormData({ ...formData, team_representative_email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Speaker 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="speaker_1_name">Speaker 1 Name *</Label>
                                <Input
                                    id="speaker_1_name"
                                    value={formData.speaker_1_name}
                                    onChange={(e) => setFormData({ ...formData, speaker_1_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="speaker_1_email">Speaker 1 Email *</Label>
                                <Input
                                    id="speaker_1_email"
                                    type="email"
                                    value={formData.speaker_1_email}
                                    onChange={(e) => setFormData({ ...formData, speaker_1_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="speaker_1_course_type">Course Type *</Label>
                                <Select
                                    value={formData.speaker_1_course_type}
                                    onValueChange={(value) => setFormData({ ...formData, speaker_1_course_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COURSE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="speaker_1_contact_number">Speaker 1 Contact *</Label>
                            <Input
                                id="speaker_1_contact_number"
                                value={formData.speaker_1_contact_number}
                                onChange={(e) => setFormData({ ...formData, speaker_1_contact_number: e.target.value })}
                                required
                            />
                        </div>

                        {/* Speaker 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="speaker_2_name">Speaker 2 Name *</Label>
                                <Input
                                    id="speaker_2_name"
                                    value={formData.speaker_2_name}
                                    onChange={(e) => setFormData({ ...formData, speaker_2_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="speaker_2_course_type">Course Type *</Label>
                                <Select
                                    value={formData.speaker_2_course_type}
                                    onValueChange={(value) => setFormData({ ...formData, speaker_2_course_type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COURSE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Researcher */}
                        <div className="space-y-2">
                            <Label htmlFor="researcher_name">Researcher Name *</Label>
                            <Input
                                id="researcher_name"
                                value={formData.researcher_name}
                                onChange={(e) => setFormData({ ...formData, researcher_name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Institution */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="institution_name">Institution Name *</Label>
                                <Input
                                    id="institution_name"
                                    value={formData.institution_name}
                                    onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class_teacher_name">Class Teacher Name *</Label>
                                <Input
                                    id="class_teacher_name"
                                    value={formData.class_teacher_name}
                                    onChange={(e) => setFormData({ ...formData, class_teacher_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class_teacher_contact_number">Teacher Contact *</Label>
                            <Input
                                id="class_teacher_contact_number"
                                value={formData.class_teacher_contact_number}
                                onChange={(e) => setFormData({ ...formData, class_teacher_contact_number: e.target.value })}
                                required
                            />
                        </div>

                        {/* Current Round */}
                        <div className="space-y-2">
                            <Label htmlFor="current_round">Current Round *</Label>
                            <Select
                                value={formData.current_round}
                                onValueChange={(value) => setFormData({ ...formData, current_round: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROUND_CHOICES.map((round) => (
                                        <SelectItem key={round.value} value={round.value}>
                                            {round.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Active Status - Only show when editing */}
                        {editingTeam && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_active">Team Status</Label>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                        />
                                        <span className={`text-sm ${formData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {formData.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Assign Jury */}
                        <div className="space-y-2">
                            <Label htmlFor="jury">Assign Jury (Optional)</Label>
                            <Select
                                value={formData.jury?.toString() || 'none'}
                                onValueChange={(value) => setFormData({ ...formData, jury: value === 'none' ? null : parseInt(value) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select jury" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {juries.map((jury) => (
                                        <SelectItem key={jury.id} value={jury.id.toString()}>
                                            {jury.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="user_password">Password *</Label>
                            <Input
                                id="user_password"
                                type="text"
                                value={formData.user_password}
                                onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
                                required
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
                            disabled={isSubmitting || !isFormValid}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {editingTeam ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>{editingTeam ? 'Update' : 'Create'} Team</>
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
                            Are you sure you want to delete team "{deletingTeam?.team_id}"? This action cannot be undone.
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

export default TeamManagement
