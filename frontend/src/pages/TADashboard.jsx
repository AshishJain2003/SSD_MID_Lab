import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  GraduationCap, 
  Filter, 
  Search, 
  Calendar,
  Users,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  BarChart3,
  Key,
  Loader2,
  RefreshCw,
  FileText,
  Edit
} from 'lucide-react';
import { teachingAssistantAPI } from '../api/teachingAssistant';
import { useToast } from '@/hooks/use-toast';
import Loader from '../components/Loader';
import TAAnswerForm from '../components/TAAnswerForm';

const TADashboard = () => {
  const [taProfile, setTaProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [classroomAccess, setClassroomAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    classroomId: 'all',
    search: '',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    limit: 20
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for classroom access first
    const access = sessionStorage.getItem('taClassroomAccess');
    if (!access) {
      toast({
        title: "Classroom Access Required",
        description: "Please select a classroom to access.",
        variant: "destructive"
      });
      navigate('/ta-classroom-access');
      return;
    }

    setClassroomAccess(JSON.parse(access));
    loadInitialData();
  }, []);

  useEffect(() => {
    if (taProfile && classroomAccess) {
      loadQuestions();
    }
  }, [filters, taProfile, classroomAccess, pagination.currentPage]);

  const loadInitialData = async () => {
    try {
      // Try to get profile first
      const profileResponse = await teachingAssistantAPI.getProfile();
      setTaProfile(profileResponse.ta);
    } catch (error) {
      console.error('TA Dashboard authentication error:', error);
      toast({
        title: "Authentication Error",
        description: "Please login again.",
        variant: "destructive"
      });
      navigate('/ta-login');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const response = await teachingAssistantAPI.getAllQuestions({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
        classroomId: classroomAccess?.classroomId || 'all'
      });

      setQuestions(response.questions);
      setPagination(response.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions.",
        variant: "destructive"
      });
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleRefresh = () => {
    if (taProfile && classroomAccess) {
      loadQuestions();
    }
  };

  const handleAnswerQuestion = async (answer, attachments) => {
    try {
      if (isEditing) {
        await teachingAssistantAPI.updateAnswer(selectedQuestion.id, answer, attachments);
      } else {
        await teachingAssistantAPI.answerQuestion(selectedQuestion.id, answer, attachments);
      }
      setShowAnswerForm(false);
      setSelectedQuestion(null);
      setIsEditing(false);
      // Refresh questions to show updated status
      loadQuestions();
    } catch (error) {
      throw error;
    }
  };

  const handleAnswerClick = (question) => {
    setSelectedQuestion(question);
    setIsEditing(false);
    setShowAnswerForm(true);
  };

  const handleEditAnswerClick = (question) => {
    setSelectedQuestion(question);
    setIsEditing(true);
    setShowAnswerForm(true);
  };

  const handleLogout = async () => {
    try {
      await teachingAssistantAPI.logout();
      // Clear classroom access
      sessionStorage.removeItem('taClassroomAccess');
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate('/ta-login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout properly.",
        variant: "destructive"
      });
      // Clear classroom access even if logout fails
      sessionStorage.removeItem('taClassroomAccess');
      navigate('/ta-login');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'important': return <Star className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'answered': return <Badge variant="secondary" className="bg-green-100 text-green-800">Answered</Badge>;
      case 'important': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Important</Badge>;
      default: return <Badge variant="outline">Unanswered</Badge>;
    }
  };

  if (loading) {
    return <Loader message="Loading TA Dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Teaching Assistant Dashboard</h1>
                <p className="text-white/90">Welcome back, {taProfile?.fullName}</p>
                {classroomAccess && (
                  <p className="text-white/80 text-sm">
                    Accessing: {classroomAccess.classroomName} ({classroomAccess.classroomCode})
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/ta-classroom-access')}
                className="bg-blue-600/20 border-blue-400/30 text-blue-100 hover:bg-blue-600 hover:text-white"
              >
                <Key size={16} className="mr-2" />
                Change Classroom
              </Button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <Card className="mb-6 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Classroom: {classroomAccess?.classroomName} ({classroomAccess?.classroomCode})
                </span>
              </div>

              <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp-desc">Newest First</SelectItem>
                  <SelectItem value="timestamp-asc">Oldest First</SelectItem>
                  <SelectItem value="author-asc">Student A-Z</SelectItem>
                  <SelectItem value="author-desc">Student Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Questions ({pagination.totalQuestions})</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={questionsLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${questionsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No questions found matching your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">{question.author}</span>
                          {getStatusIcon(question.status)}
                          {getStatusBadge(question.status)}
                          {question.classroom && (
                            <Badge variant="outline" className="ml-2">
                              {question.classroom.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-foreground mb-2">{question.question}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Category: {question.category}</span>
                          <span>Posted: {new Date(question.timestamp).toLocaleString()}</span>
                          {question.classroom && (
                            <span>Class: {question.classroom.code}</span>
                          )}
                        </div>
                        
                        {/* Show existing answer if answered */}
                        {question.taAnswer && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                  Answered by {question.taAnswer.answeredBy?.fullName || 'TA'}
                                </span>
                                <span className="text-xs text-green-600">
                                  {new Date(question.taAnswer.answeredAt).toLocaleString()}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAnswerClick(question)}
                                className="text-green-700 hover:text-green-800 hover:bg-green-100"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                            <p className="text-sm text-green-700 mb-2">{question.taAnswer.answer}</p>
                            {question.taAnswer.attachments && question.taAnswer.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {question.taAnswer.attachments.map((attachment, index) => (
                                  <a
                                    key={index}
                                    href={`http://localhost:5000/uploads/${attachment.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                  >
                                    <FileText className="h-3 w-3" />
                                    {attachment.originalName}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Answer button for unanswered questions */}
                      <div className="flex-shrink-0 ml-4">
                        {question.status === 'unanswered' ? (
                          <Button
                            size="sm"
                            onClick={() => handleAnswerClick(question)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Answer
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Answered
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Answer Form Modal */}
      {showAnswerForm && selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TAAnswerForm
              question={selectedQuestion}
              onAnswer={handleAnswerQuestion}
              isEditing={isEditing}
              onCancel={() => {
                setShowAnswerForm(false);
                setSelectedQuestion(null);
                setIsEditing(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TADashboard;
