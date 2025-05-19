
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileAudio, Users, UserCheck, LogIn, Play } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';

const ActionCards: React.FC = () => {
  const { user } = useUserContext();
  
  return (
    <section id="actions" className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-600" />
                View Agent Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-4">
              <p className="text-gray-600">Browse available agents and preview their profiles.</p>
              <p className="text-amber-600 text-sm font-medium">Note: Register to listen to audio samples</p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/agents" className="flex items-center justify-between w-full">
                  Browse Profiles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-green-600" />
                Register as an Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-4">
              <p className="text-gray-600">Create your agent profile and upload your audio samples.</p>
              <p className="text-gray-600 text-sm">Get discovered by businesses looking for call center agents.</p>
              <Button asChild className="mt-2 bg-green-600 hover:bg-green-700">
                <Link to="/auth?tab=signup" className="flex items-center justify-between w-full">
                  Sign Up as Agent
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center gap-3">
                <FileAudio className="h-6 w-6 text-purple-600" />
                Business Access
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-4">
              <p className="text-gray-600">Find the perfect agents for your business needs.</p>
              <p className="text-gray-600 text-sm">Full access to profiles, audio samples and contact information.</p>
              <Button asChild className="mt-2 bg-purple-600 hover:bg-purple-700">
                <Link to="/business-signup" className="flex items-center justify-between w-full">
                  Business Sign Up
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-center space-y-4">
          <Button asChild variant="outline" className="bg-amber-50 hover:bg-amber-100 flex items-center gap-2 mx-auto border-amber-200">
            <Link to="/samples" className="flex items-center gap-2">
              <Play className="h-4 w-4 text-amber-700" />
              Listen to Voice Samples
            </Link>
          </Button>
          
          <p className="text-gray-600 mt-6">Already registered?</p>
          <Button asChild variant="outline" className="flex items-center gap-2 mx-auto">
            <Link to="/auth">
              <LogIn className="h-4 w-4" />
              Login to Your Account
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActionCards;
