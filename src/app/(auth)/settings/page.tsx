'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Configuration } from '@/types/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { configSchema, ConfigInput } from '@/schemas/config';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
    watch: watchCreate,
  } = useForm<ConfigInput>({
    resolver: zodResolver(configSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    watch: watchEdit,
    setValue: setValueEdit,
  } = useForm<ConfigInput>({
    resolver: zodResolver(configSchema),
  });

  const createType = watchCreate('type');
  const editType = watchEdit('type');

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar configurações');
      }

      const data = await response.json();
      setConfigurations(data.configurations);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateSubmit = async (data: ConfigInput) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar configuração');
      }

      const result = await response.json();
      toast.success(result.message);
      setIsCreateDialogOpen(false);
      resetCreate();
      loadConfigurations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar configuração');
    }
  };

  const onEditSubmit = async (data: ConfigInput) => {
    if (!editingConfig) return;

    try {
      const response = await fetch(`/api/config/${editingConfig.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar configuração');
      }

      const result = await response.json();
      toast.success(result.message);
      setIsEditDialogOpen(false);
      setEditingConfig(null);
      resetEdit();
      loadConfigurations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar configuração');
    }
  };

  const handleEdit = (config: Configuration) => {
    setEditingConfig(config);
    setValueEdit('key', config.key);
    setValueEdit('value', config.value);
    setValueEdit('type', config.type);
    setValueEdit('description', config.description || '');
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (configId: string) => {
    try {
      const response = await fetch(`/api/config/${configId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar configuração');
      }

      const result = await response.json();
      toast.success(result.message);
      loadConfigurations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao deletar configuração');
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      URL: 'bg-blue-100 text-blue-800',
      TEXT: 'bg-gray-100 text-gray-800',
      NUMBER: 'bg-green-100 text-green-800',
      BOOLEAN: 'bg-purple-100 text-purple-800',
      JSON: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatValue = (value: string, type: string) => {
    if (type === 'JSON') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }
    return value;
  };

  const getValuePreview = (value: string, type: string) => {
    if (value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value;
  };

  const filteredConfigurations = configurations.filter(config =>
    config.key.toLowerCase().includes(search.toLowerCase()) ||
    config.description?.toLowerCase().includes(search.toLowerCase())
  );

  const renderValueInput = (type: string, register: any, errors: any) => {
    switch (type) {
      case 'BOOLEAN':
        return (
          <Select onValueChange={(value) => register('value').onChange({ target: { value } })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Verdadeiro</SelectItem>
              <SelectItem value="false">Falso</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'JSON':
        return (
          <textarea
            {...register('value')}
            placeholder='{"exemplo": "valor"}'
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'NUMBER':
        return (
          <Input
            {...register('value')}
            type="number"
            placeholder="123"
            className={errors?.value ? 'border-red-500' : ''}
          />
        );
      case 'URL':
        return (
          <Input
            {...register('value')}
            type="url"
            placeholder="https://exemplo.com"
            className={errors?.value ? 'border-red-500' : ''}
          />
        );
      default:
        return (
          <Input
            {...register('value')}
            type="text"
            placeholder="Valor da configuração"
            className={errors?.value ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as configurações dinâmicas do sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Configuração
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Configuração</DialogTitle>
              <DialogDescription>
                Adicione uma nova configuração dinâmica ao sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-key">Chave</Label>
                  <Input
                    id="create-key"
                    {...registerCreate('key')}
                    placeholder="nome_da_configuracao"
                    className={errorsCreate.key ? 'border-red-500' : ''}
                  />
                  {errorsCreate.key && (
                    <p className="text-sm text-red-500">{errorsCreate.key.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-type">Tipo</Label>
                  <Select onValueChange={(value) => registerCreate('type').onChange({ target: { value } })}>
                    <SelectTrigger className={errorsCreate.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Texto</SelectItem>
                      <SelectItem value="NUMBER">Número</SelectItem>
                      <SelectItem value="BOOLEAN">Booleano</SelectItem>
                      <SelectItem value="URL">URL</SelectItem>
                      <SelectItem value="JSON">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorsCreate.type && (
                    <p className="text-sm text-red-500">{errorsCreate.type.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-value">Valor</Label>
                {renderValueInput(createType, registerCreate, errorsCreate)}
                {errorsCreate.value && (
                  <p className="text-sm text-red-500">{errorsCreate.value.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">Descrição (opcional)</Label>
                <Input
                  id="create-description"
                  {...registerCreate('description')}
                  placeholder="Descrição da configuração"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Lista de Configurações</CardTitle>
              <CardDescription>
                Total de {configurations.length} configurações
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar configurações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chave</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigurations.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-mono text-sm">{config.key}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(config.type)}>
                          {config.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={formatValue(config.value, config.type)}>
                          {getValuePreview(config.value, config.type)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">
                          {config.description || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(config.updatedAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(config)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Deletar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja deletar a configuração <strong>{config.key}</strong>? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(config.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Deletar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredConfigurations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma configuração encontrada
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Configuração</DialogTitle>
            <DialogDescription>
              Modifique os dados da configuração
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-key">Chave</Label>
                <Input
                  id="edit-key"
                  {...registerEdit('key')}
                  placeholder="nome_da_configuracao"
                  className={errorsEdit.key ? 'border-red-500' : ''}
                />
                {errorsEdit.key && (
                  <p className="text-sm text-red-500">{errorsEdit.key.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo</Label>
                <Select 
                  value={editType} 
                  onValueChange={(value) => setValueEdit('type', value as any)}
                >
                  <SelectTrigger className={errorsEdit.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="NUMBER">Número</SelectItem>
                    <SelectItem value="BOOLEAN">Booleano</SelectItem>
                    <SelectItem value="URL">URL</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
                {errorsEdit.type && (
                  <p className="text-sm text-red-500">{errorsEdit.type.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-value">Valor</Label>
              {renderValueInput(editType, registerEdit, errorsEdit)}
              {errorsEdit.value && (
                <p className="text-sm text-red-500">{errorsEdit.value.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Input
                id="edit-description"
                {...registerEdit('description')}
                placeholder="Descrição da configuração"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}