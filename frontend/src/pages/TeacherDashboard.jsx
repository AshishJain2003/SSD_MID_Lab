import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Copy, ExternalLink, LogOut, Trash2 } from 'lucide-react';
import { classroomAPI } from '../api/classroom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!user) {
      navigate('/teacher-login');
      return;
    }

    try {
      const teacherClassrooms = await classroomAPI.getClassrooms();
      setClassrooms(teacherClassrooms.classrooms);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!newClassroomName.trim()) return;

    setCreating(true);
    try {
      const newClassroom = await classroomAPI.createClassroom(newClassroomName.trim());

      setClassrooms([...classrooms, { id: newClassroom.code, name: newClassroom.name }]);
      setNewClassroomName('');
      setShowCreateForm(false);

      toast({
        title: "Classroom Created!",
        description: `Classroom "${newClassroom.name}" created with code: ${newClassroom.code}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create classroom.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Classroom code copied to clipboard."
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const joinClassroom = (classroomId) => {
    navigate(`/classroom-view/${classroomId}`);
  };

  const handleDeleteClassroom = async (classroomId) => {
    if (!window.confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
      return;
    }

    try {
      await classroomAPI.deleteClassroom(classroomId);
      setClassrooms(classrooms.filter(classroom => classroom.id !== classroomId));
      toast({
        title: "Classroom Deleted",
        description: "The classroom has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete classroom.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-primary shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.username}!</h1>
              <p className="text-white/90">Manage your classrooms and student questions</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-foreground">Your Classrooms</h2>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-primary text-white"
          >
            <Plus size={16} className="mr-2" />
            Create New Classroom
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle>Create New Classroom</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClassroom} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="classroomName">Classroom Name</Label>
                  <Input
                    id="classroomName"
                    value={newClassroomName}
                    onChange={(e) => setNewClassroomName(e.target.value)}
                    placeholder="Enter classroom name"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {classrooms.length === 0 ? (
          <Card className="text-center py-12 shadow-card">
            <CardContent>
              <p className="text-muted-foreground text-lg mb-4">
                No classrooms yet. Create your first classroom to get started!
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-primary text-white"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Classroom
              </Button>
            </CardContent>
          </Card>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {classrooms.map(classroom => (
               <Card key={classroom.id} className="shadow-card hover:shadow-hover transition-all duration-300">
                 <CardHeader>
                   <CardTitle className="text-primary">{classroom.name}</CardTitle>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">
                       Code: <span className="font-mono font-bold">{classroom.id}</span>
                     </span>
                     <div className="flex gap-2">
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => copyToClipboard(classroom.id)}
                       >
                         <Copy size={14} />
                       </Button>
                       <Button
                         size="sm"
                         variant="outline"
                         onClick={() => handleDeleteClassroom(classroom.id)}
                         className="text-red-500 hover:text-red-700"
                       >
                         <Trash2 size={14} />
                       </Button>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-2 mb-4">
                     <p className="text-sm text-muted-foreground">
                       Created: Recently
                     </p>
                   </div>
                   <Button
                     className="w-full bg-accent text-white"
                     onClick={() => joinClassroom(classroom.id)}
                   >
                     <ExternalLink size={16} className="mr-2" />
                     View Classroom
                   </Button>
                 </CardContent>
               </Card>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;