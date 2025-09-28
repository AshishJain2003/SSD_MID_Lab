import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, ArrowLeft, Key } from 'lucide-react';
import { teachingAssistantAPI } from '../api/teachingAssistant';
import { classroomAPI } from '../api/classroom';
import { useToast } from '@/hooks/use-toast';

const TAClassroomAccess = () => {
  const [classroomCode, setClassroomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!classroomCode.trim()) {
      setErrors({ classroomCode: 'Classroom code is required' });
      setLoading(false);
      return;
    }

    try {
      // Verify the classroom exists and get its details
      const classroom = await classroomAPI.getClassroomByCode(classroomCode.trim().toUpperCase());
      
      // Store the classroom access in session storage
      sessionStorage.setItem('taClassroomAccess', JSON.stringify({
        classroomId: classroom._id,
        classroomCode: classroom.code,
        classroomName: classroom.name,
        accessTime: new Date().toISOString()
      }));

      toast({
        title: "Access Granted!",
        description: `You can now access ${classroom.name} (${classroom.code})`,
      });

      navigate('/ta-dashboard');
    } catch (error) {
      setErrors({ submit: 'Invalid classroom code. Please check and try again.' });
      toast({
        title: "Access Denied",
        description: "Invalid classroom code. Please check and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setClassroomCode(e.target.value.toUpperCase());
    // Clear errors when user starts typing
    if (errors.classroomCode || errors.submit) {
      setErrors({});
    }
  };

  const handleLogout = () => {
    // Clear TA session
    sessionStorage.removeItem('taClassroomAccess');
    navigate('/ta-login');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm shadow-hover border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Key className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-primary">Classroom Access</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter the classroom code to access questions for review
            </p>
          </CardHeader>
          
          <CardContent>
            {errors.submit && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="classroomCode">Classroom Code</Label>
                <Input
                  id="classroomCode"
                  name="classroomCode"
                  type="text"
                  value={classroomCode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit classroom code"
                  required
                  disabled={loading}
                  className={`uppercase tracking-widest text-center text-lg font-mono ${
                    errors.classroomCode ? 'border-red-300' : ''
                  }`}
                  maxLength={6}
                />
                {errors.classroomCode && (
                  <p className="text-sm text-red-600 mt-1">{errors.classroomCode}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Ask the teacher for the 6-digit classroom code
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-white" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Access...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Access Classroom
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">
                How to get classroom access:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ask the teacher for the classroom code</li>
                <li>• Enter the 6-digit code above</li>
                <li>• You'll only see questions from that classroom</li>
                <li>• Access expires when you log out</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TAClassroomAccess;
