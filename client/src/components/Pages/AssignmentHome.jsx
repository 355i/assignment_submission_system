import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, Clock, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const statusColors = {
    1: 'bg-green-100 text-green-800 hover:bg-green-200',
    2: 'bg-red-400 text-white hover:bg-red-500',
    3: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
};

export function AssignmentHome() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:1000/assignment', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || `HTTP ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setAssignments(data);
                setFilteredAssignments(data);
            } catch (err) {
                setError(`Failed to load assignments: ${err.message}`);
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);


    useEffect(() => {
        let result = [...assignments];
        if (filter !== 'all') {
            result = result.filter((assignment) => assignment.status === filter);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((assignment) =>
                assignment.title.toLowerCase().includes(query) ||
                assignment.course_name.toLowerCase().includes(query)
            );
        }
        setFilteredAssignments(result);
    }, [filter, searchQuery, assignments]);

    const formatDateTime = (datetime) => {
        if (!datetime || typeof datetime !== 'string') {
            return { formattedDate: 'Date not available', formattedTime: 'Time not available' };
        }

        const dateObj = new Date(datetime);
        if (isNaN(dateObj.getTime())) {
            return { formattedDate: 'Invalid Date', formattedTime: 'Invalid Time' };
        }

        const formattedDate = dateObj.toLocaleDateString('en-US');
        const formattedTime = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return { formattedDate, formattedTime };
    };

    if (loading) {
        return <div>Loading assignments...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="w-screen h-full min-h-screen space-y-6 p-2 my-20 mx-6">
            <Tabs defaultValue="list" className="w-full space-y-4 px-8">
                <TabsList className="w-full gap-2">
                    <TabsTrigger value="list" className="flex flex-col items-center justify-center hover:bg-blue-200">
                        <SlidersHorizontal className="h-6 w-80" /> List
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="w-full">
                    {filteredAssignments.length === 0 ? (
                        <Card className="w-full text-center p-6">
                            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No assignments found</h3>
                        </Card>
                    ) : (
                        <div className="grid gap-4 w-full">
                            {filteredAssignments.map((assignment) => {
                                const { formattedDate, formattedTime } = formatDateTime(assignment.time);
                                return (
                                    <Card
                                        key={assignment.id}
                                        className="w-full p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                        onClick={() => navigate(`/assignment/${assignment.id}`)}
                                    >
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <h3 className="text-lg font-bold text-blue-600">{assignment.title}</h3>
                                            <p className="text-sm text-gray-600">Course: {assignment.course_name}</p>
                                            <Badge className={cn(statusColors[assignment.status])}>
                                                {assignment.status === 1 ? 'Completed' : assignment.status === 2 ? 'Live' : 'Upcoming'}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                            <div>
                                                <Calendar className="h-4 w-4 inline-block" /> {formattedDate}
                                            </div>
                                            <div>
                                                <Clock className="h-4 w-4 inline-block" /> {formattedTime}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
