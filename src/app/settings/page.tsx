"use client";

//import { useCsvStore } from "@/store/csvStore"; // Optional: if settings relate to data
//import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  // const { processedData, isLoading, error } = useCsvStore(); // Example if needed

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Preferências da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Nome de Usuário (Em Breve)</Label>
              <Input id="username" placeholder="Seu nome de usuário" disabled />
            </div>
            <div>
              <Label htmlFor="email">Email (Em Breve)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                disabled
              />
            </div>
            <Button disabled className="w-full">
              Salvar Preferências (Em Breve)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Funcionalidade de preferências de conta em desenvolvimento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Categorias (Em Breve)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Adicione, edite ou remova categorias de transação personalizadas.
              Esta funcionalidade permitirá que você organize seus gastos de
              acordo com suas próprias necessidades.
            </p>
            {/* Placeholder for category list and management actions */}
            <div className="border border-dashed rounded-md p-4 min-h-[100px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Gerenciamento de categorias em desenvolvimento.
              </p>
            </div>
            <Button disabled className="w-full">
              Adicionar Nova Categoria (Em Breve)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tema e Aparência (Em Breve)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Personalize a aparência do aplicativo.
            </p>
            {/* Placeholder for theme selection */}
            <div className="border border-dashed rounded-md p-4 min-h-[50px] flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Seleção de tema em desenvolvimento.
              </p>
            </div>
            <Button disabled className="w-full">
              Aplicar Tema (Em Breve)
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Exportar Dados (Em Breve)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Exporte seus dados processados em formatos como CSV ou JSON.
            </p>
            <Button disabled className="w-full">
              Exportar como CSV (Em Breve)
            </Button>
            <Button disabled className="w-full">
              Exportar como JSON (Em Breve)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Funcionalidade de exportação em desenvolvimento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limpar Dados Locais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remova todos os dados de faturas carregadas do armazenamento local
              do navegador.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                // useCsvStore.getState().clearData(); // Example: Direct call if needed and safe
                // Or, more commonly, call a method from the store hook if it handles UI updates
                alert(
                  "Funcionalidade de limpar dados em desenvolvimento. (Simulação: dados seriam limpos aqui)"
                );
              }}
            >
              Limpar Dados Carregados (Em Breve)
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Esta ação não pode ser desfeita.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
