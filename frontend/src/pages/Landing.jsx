import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, PlusCircle, GraduationCap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div
            className="flex justify-center items-center mb-4"
            style={{ gap: "30px" }} 
          >
            <BookOpen
              className="text-blue-500"
              style={{ height: "120px", width: "120px" }}
            />
            <h1
              className="font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
              style={{ fontSize: "110px" }}
            >
              VidyaVichar
            </h1>
          </div>
          <p className="text-xl text-white/90 mb-8">
            Interactive Classroom Questions - Connect Teachers and Students
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card
            className="bg-white/95 backdrop-blur-sm shadow-hover border-0 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/teacher-options")}
          >
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full">
                <PlusCircle className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">
                Create Classroom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Start a new classroom session and get a code to share with your
                students
              </p>
              <Button className="w-full bg-gradient-primary text-white border-0 hover:shadow-hover">
                Get Started as Teacher
              </Button>
            </CardContent>
          </Card>

          <Card
            className="bg-white/95 backdrop-blur-sm shadow-hover border-0 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("/student-join")}
          >
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-2xl text-accent">
                Join Classroom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Enter the classroom code provided by your teacher to join the
                session
              </p>
              <Button className="w-full bg-gradient-primary text-white border-0 hover:shadow-hover">
                Join as Student
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-hover border-0 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-green-500/10 rounded-full">
                <GraduationCap className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Teaching Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Review and analyze all classroom questions for additional
                clarifications
              </p>
              <div className="space-y-2">
                <Button
                  className="w-full bg-gradient-primary text-white border-0 hover:shadow-hover"
                  onClick={() => navigate("/ta-login")}
                >
                  TA Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-gradient-primary text-white border-0 hover:shadow-hover"
                  onClick={() => navigate("/ta-signup")}
                >
                  TA Signup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-white/80">
          <p className="text-sm">
            A collaborative platform for interactive classroom questions and
            discussions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
