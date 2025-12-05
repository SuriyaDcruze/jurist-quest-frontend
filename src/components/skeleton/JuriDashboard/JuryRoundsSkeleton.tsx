import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const JuryRoundsSkeleton = () => {
    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Competition Schedule Skeleton */}
            <div className="rounded-2xl bg-gradient-to-b from-secondary/60 to-background border border-border p-8 shadow-sm">
                <Skeleton className="h-10 w-80 mb-2" />
                <Skeleton className="h-4 w-48 mb-6" />

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, idx) => (
                        <Card key={idx} className="transition-transform duration-200">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    {idx < 2 && <Skeleton className="h-5 w-16 rounded-full" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, idx) => (
                    <Card key={idx} className="border-l-4">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-20 mb-2" />
                                    <Skeleton className="h-8 w-12" />
                                </div>
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Rounds Table Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-64" />
                </CardHeader>
                <CardContent>
                    {/* Desktop View Skeleton */}
                    <div className="hidden md:block overflow-x-auto">
                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-6 gap-4 pb-3 border-b">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            {/* Table Rows */}
                            {[...Array(5)].map((_, idx) => (
                                <div key={idx} className="grid grid-cols-6 gap-4 py-4 border-b">
                                    <Skeleton className="h-5 w-24" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-3 w-8" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-8 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View Skeleton */}
                    <div className="md:hidden space-y-4">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-32" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-8 w-20" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default JuryRoundsSkeleton
