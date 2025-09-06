import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNeuralModels, NeuralModel } from "@/hooks/useNeuralModels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { userModels, loading, fetchUserModels, updateModel, deleteModel } = useNeuralModels();
  const [editingModel, setEditingModel] = useState<NeuralModel | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", is_public: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserModels();
    }
  }, [user, fetchUserModels]);

  const handleEdit = (model: NeuralModel) => {
    setEditingModel(model);
    setEditForm({
      name: model.name,
      description: model.description || "",
      is_public: model.is_public
    });
  };

  const handleSaveEdit = async () => {
    if (!editingModel) return;

    const success = await updateModel(editingModel.id, {
      name: editForm.name,
      description: editForm.description || undefined,
      is_public: editForm.is_public
    });

    if (success) {
      setEditingModel(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteModel(id);
  };

  const handleLoadModel = (model: NeuralModel) => {
    // Store model data in localStorage for playground to pick up
    localStorage.setItem('loadModel', JSON.stringify(model.model_data.layers));
    navigate('/playground');
    toast.success('Model loaded in playground');
  };

  const handleExportModel = (model: NeuralModel) => {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your models...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              My Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your neural network models
            </p>
          </div>
          <Button onClick={() => navigate('/playground')} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create New Model
          </Button>
        </div>

        {userModels.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">No models yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first neural network model in the playground
              </p>
              <Button onClick={() => navigate('/playground')}>
                <Plus className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userModels.map((model) => (
              <Card key={model.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {model.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <Badge variant={model.is_public ? "default" : "secondary"}>
                      {model.is_public ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>Layers: {model.model_data.layers.length}</p>
                    <p>Created: {new Date(model.created_at).toLocaleDateString()}</p>
                    <p>Updated: {new Date(model.updated_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadModel(model)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Load
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(model)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Model</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                              id="edit-name"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="edit-public"
                              checked={editForm.is_public}
                              onCheckedChange={(checked) => setEditForm({ ...editForm, is_public: checked })}
                            />
                            <Label htmlFor="edit-public">Make public</Label>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingModel(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportModel(model)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Model</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{model.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(model.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default Dashboard;