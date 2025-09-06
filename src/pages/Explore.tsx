import { useEffect } from "react";
import { useNeuralModels } from "@/hooks/useNeuralModels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const { publicModels, loading, fetchPublicModels } = useNeuralModels();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicModels();
  }, [fetchPublicModels]);

  const handleLoadModel = (model: any) => {
    // Store model data in localStorage for playground to pick up
    localStorage.setItem('loadModel', JSON.stringify(model.model_data.layers));
    navigate('/playground');
    toast.success('Model loaded in playground');
  };

  const handleExportModel = (model: any) => {
    const networkData = {
      id: model.id,
      name: model.name,
      layers: model.model_data.layers,
      created_at: model.created_at,
      modified_at: model.updated_at
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
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading public models...</p>
          </div>
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
            {publicModels.map((model) => (
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
                      <span>Community Model</span>
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