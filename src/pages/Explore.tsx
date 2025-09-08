import { useEffect, useState } from "react";
import { useNeuralModels } from "@/hooks/useNeuralModels";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, User, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const { publicModels, loading, fetchPublicModels } = useNeuralModels();
  const { fetchProfile } = useProfiles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [modelCreators, setModelCreators] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPublicModels();
  }, [fetchPublicModels]);

  // Fetch creator names for models
  useEffect(() => {
    const fetchCreators = async () => {
      const creators: Record<string, string> = {};
      for (const model of publicModels) {
        if (!modelCreators[model.user_id]) {
          const profile = await fetchProfile(model.user_id);
          creators[model.user_id] = profile?.display_name || 'Anonymous User';
        }
      }
      setModelCreators(prev => ({ ...prev, ...creators }));
    };

    if (publicModels.length > 0) {
      fetchCreators();
    }
  }, [publicModels, fetchProfile]);

  // Filter models based on search query
  const filteredModels = publicModels.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    modelCreators[model.user_id]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadModel = (model: any) => {
    // Store model data in localStorage for playground to pick up
    localStorage.setItem('loadModel', JSON.stringify(model.model_data.layers));
    navigate('/playground');
    toast.success('Model loaded in playground');
  };

  const handleExportModel = (model: any) => {
    if (!user) {
      toast.error('Please sign in to download models');
      navigate('/auth');
      return;
    }

    const networkData = {
      id: model.id,
      name: model.name,
      layers: model.model_data.layers,
      created_at: model.created_at,
      modified_at: model.updated_at,
      creator: modelCreators[model.user_id] || 'Anonymous User'
    };
    
    const blob = new Blob([JSON.stringify(networkData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Model downloaded successfully');
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Explore Models
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover neural network architectures created by the community. Load any model into the playground to experiment and learn.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search models, creators, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading public models...</p>
          </div>
        ) : filteredModels.length === 0 && searchQuery ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground mb-4">
                No models match your search criteria. Try different keywords.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : publicModels.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No public models yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share a neural network model with the community!
              </p>
              <Button onClick={() => navigate('/playground')}>
                Create & Share a Model
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <Card key={model.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {model.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <Badge variant="default">Public</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <User className="w-3 h-3" />
                      <span>By {modelCreators[model.user_id] || 'Loading...'}</span>
                    </div>
                    <p>Layers: {model.model_data.layers.length}</p>
                    <p>Created: {new Date(model.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleLoadModel(model)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Load in Playground
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportModel(model)}
                      disabled={!user}
                      title={!user ? "Sign in required to download" : "Download model"}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;