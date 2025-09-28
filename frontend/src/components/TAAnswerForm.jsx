import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TAAnswerForm = ({ question, onAnswer, onCancel, isEditing = false }) => {
  const [answer, setAnswer] = useState(isEditing && question.taAnswer ? question.taAnswer.answer : '');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed.",
        variant: "destructive"
      });
    }
    
    if (pdfFiles.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 PDF files allowed.",
        variant: "destructive"
      });
      pdfFiles.splice(5);
    }
    
    setAttachments(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await onAnswer(answer, attachments);
      setAnswer('');
      setAttachments([]);
      toast({
        title: isEditing ? "Answer Updated" : "Answer Submitted",
        description: isEditing ? "Your answer has been updated." : "Question has been marked as answered.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          {isEditing ? 'Edit Answer' : 'Answer Question'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Question:</p>
          <p className="font-medium">{question.question}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Asked by {question.author} • {new Date(question.timestamp).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="answer">Your Answer</Label>
            <Textarea
              id="answer"
              placeholder={isEditing ? "Update your answer..." : "Provide a detailed answer to help the student..."}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="attachments">PDF Attachments (Optional)</Label>
            
            {/* Show existing attachments when editing */}
            {isEditing && question.taAnswer && question.taAnswer.attachments && question.taAnswer.attachments.length > 0 && (
              <div className="mt-2 mb-3">
                <p className="text-sm text-muted-foreground mb-2">Current attachments:</p>
                <div className="space-y-1">
                  {question.taAnswer.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span className="flex-1">{attachment.originalName}</span>
                      <a
                        href={`http://localhost:5000/uploads/${attachment.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload new files to replace existing attachments
                </p>
              </div>
            )}
            
            <div className="mt-2">
              <input
                id="attachments"
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments').click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isEditing ? 'Upload New PDF Files (Max 5)' : 'Upload PDF Files (Max 5)'}
              </Button>
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Answer' : 'Submit Answer'}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TAAnswerForm;
