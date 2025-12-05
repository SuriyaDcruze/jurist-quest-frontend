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
import { MessageSquare, Search, CheckCircle, Clock, Loader2 } from "lucide-react"
import useAdminClarifications, { Clarification } from "@/hooks/useAdminClarifications"
import { useToast } from "@/hooks/use-toast"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const ClarificationManagement = () => {
    const { clarifications, isLoading, updateClarification } = useAdminClarifications()
    const { toast } = useToast()

    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedClarification, setSelectedClarification] = useState<Clarification | null>(null)
    const [response, setResponse] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const filteredClarifications = clarifications.filter(clarification =>
        clarification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clarification.team_details.team_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenDialog = (clarification: Clarification) => {
        setSelectedClarification(clarification)
        setResponse(clarification.response || '')
        setIsDialogOpen(true)
    }

    const handleSubmit = async () => {
        if (!selectedClarification) return

        // Validate response
        if (!response || response.trim() === '' || response === '<p><br></p>') {
            toast({
                title: "Validation Error",
                description: "Please provide a response before submitting",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            await updateClarification({ id: selectedClarification.id, data: { response } })
            toast({
                title: "Success",
                description: "Response sent successfully. Team will be notified via email.",
            })

            // Reset form state
            setSelectedClarification(null)
            setResponse('')
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.detail || "Failed to send response",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
                            <CardTitle className="text-2xl font-bold">Clarification Management</CardTitle>
                            <div className="flex gap-4 text-sm">
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                            </div>
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
                                        <TableHead>Team</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
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
                        <CardTitle className="text-2xl font-bold">Clarification Management</CardTitle>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span>{clarifications.filter(c => !c.response).length} Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>{clarifications.filter(c => c.response).length} Answered</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by subject or team ID..."
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
                                    <TableHead>Team</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClarifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500">
                                            No clarifications found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClarifications.map((clarification) => (
                                        <TableRow key={clarification.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{clarification.team_details.team_id}</p>
                                                    <p className="text-xs text-gray-500">{clarification.team_details.institution_name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{clarification.subject}</TableCell>
                                            <TableCell className="max-w-xs truncate">{clarification.question}</TableCell>
                                            <TableCell>
                                                {clarification.response ? (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Answered
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                                                        <Clock className="h-3 w-3" />
                                                        Pending
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>{new Date(clarification.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenDialog(clarification)}
                                                    title={clarification.response ? "View/Edit Response" : "Answer"}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Answer Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Clarification Request</DialogTitle>
                        <DialogDescription>
                            {selectedClarification?.response ? 'View or update your response' : 'Provide a response to this clarification request'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClarification && (
                        <div className="grid gap-4 py-4">
                            {/* Team Info */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Team ID</Label>
                                        <p className="mt-1">{selectedClarification.team_details.team_id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Institution</Label>
                                        <p className="mt-1">{selectedClarification.team_details.institution_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Subject</Label>
                                <p className="font-medium">{selectedClarification.subject}</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Question</Label>
                                <div className="bg-gray-50 p-3 rounded border">
                                    <p className="text-sm whitespace-pre-wrap">{selectedClarification.question}</p>
                                </div>
                            </div>

                            {/* Response */}
                            <div className="space-y-2 border-t pt-4">
                                <Label htmlFor="response">Your Response *</Label>
                                <ReactQuill
                                    theme="snow"
                                    value={response}
                                    onChange={setResponse}
                                    modules={modules}
                                    className="bg-white"
                                    style={{ height: '200px', marginBottom: '50px' }}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#2d4817] hover:bg-[#1f3210]"
                            disabled={isSubmitting || !response || response.trim() === '' || response === '<p><br></p>'}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>Send Response</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ClarificationManagement
