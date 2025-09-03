"use client";

import { AgGridReact } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  AllCommunityModule,
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
} from "ag-grid-community";
import {
  RefreshCw,
  Plus,
  Users,
  Shield,
  School,
  Edit,
  Trash2,
} from "lucide-react";
import { useMemo, useCallback, useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface UserSchoolData {
  _id: Id<"userSchool">;
  userId: Id<"user">;
  schoolId: Id<"school">;
  role: string[];
  status: "active" | "inactive";
  department?: "secretary" | "direction" | "schoolControl" | "technology";
  createdAt: number;
  updatedAt: number;
}

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Home() {
  const userSchoolData: Array<UserSchoolData> = [
    {
      _id: "userSchool_1" as Id<"userSchool">,
      userId: "user_101" as Id<"user">,
      schoolId: "school_501" as Id<"school">,
      role: ["admin", "teacher"],
      status: "active",
      department: "technology",
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now(),
    },
    {
      _id: "userSchool_2" as Id<"userSchool">,
      userId: "user_102" as Id<"user">,
      schoolId: "school_502" as Id<"school">,
      role: ["student"],
      status: "inactive",
      department: "schoolControl",
      createdAt: Date.now() - 2000000,
      updatedAt: Date.now() - 50000,
    },
    {
      _id: "userSchool_3" as Id<"userSchool">,
      userId: "user_103" as Id<"user">,
      schoolId: "school_503" as Id<"school">,
      role: ["teacher"],
      status: "active",
      department: "direction",
      createdAt: Date.now() - 3000000,
      updatedAt: Date.now() - 10000,
    },
    {
      _id: "userSchool_4" as Id<"userSchool">,
      userId: "user_104" as Id<"user">,
      schoolId: "school_504" as Id<"school">,
      role: ["secretary"],
      status: "active",
      department: "secretary",
      createdAt: Date.now() - 4000000,
      updatedAt: Date.now() - 5000,
    },
    {
      _id: "userSchool_5" as Id<"userSchool">,
      userId: "user_105" as Id<"user">,
      schoolId: "school_505" as Id<"school">,
      role: ["teacher", "coordinator"],
      status: "inactive",
      // este sin departamento para probar opcionalidad
      createdAt: Date.now() - 5000000,
      updatedAt: Date.now() - 1000,
    },
  ];

  // const stats = useQuery(api.userSchool.getStats)
  // const createUserSchool = useMutation(api.userSchool.create)
  // const updateUserSchool = useMutation(api.userSchool.update)
  // const deleteUserSchool = useMutation(api.userSchool.remove)

  const [selectedRow, setSelectedRow] = useState<UserSchoolData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(false);

  // Componente personalizado para mostrar roles como badges
  const RolesCellRenderer = ({ value }: { value: string[] }) => (
    <div className="flex gap-1 flex-wrap">
      {value?.map((role, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {role}
        </Badge>
      ))}
    </div>
  );

  // Componente para mostrar estado
  const StatusCellRenderer = ({ value }: { value: string }) => (
    <Badge variant={value === "active" ? "default" : "destructive"}>
      {value}
    </Badge>
  );

  // Componente para mostrar fecha formateada
  const DateCellRenderer = ({ value }: { value: number }) => (
    <span className="text-sm text-muted-foreground">
      {format(new Date(value), "dd/MM/yyyy HH:mm")}
    </span>
  );

  // Componente para acciones
  const ActionsCellRenderer = ({ data }: { data: UserSchoolData }) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleEdit(data)}
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleDelete(data._id)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "ID",
        field: "_id",
        width: 120,
        pinned: "left",
      },
      {
        headerName: "Usuario ID",
        field: "userId",
        width: 140,
        filter: true,
      },
      {
        headerName: "Escuela ID",
        field: "schoolId",
        width: 140,
        filter: true,
      },
      {
        headerName: "Roles",
        field: "role",
        width: 200,
        cellRenderer: RolesCellRenderer,
        filter: true,
      },
      {
        headerName: "Estado",
        field: "status",
        width: 100,
        cellRenderer: StatusCellRenderer,
        filter: true,
      },
      {
        headerName: "Departamento",
        field: "department",
        width: 140,
        filter: true,
      },
      {
        headerName: "Creado",
        field: "createdAt",
        width: 160,
        cellRenderer: DateCellRenderer,
        sort: "desc",
      },
      {
        headerName: "Actualizado",
        field: "updatedAt",
        width: 160,
        cellRenderer: DateCellRenderer,
      },
      {
        headerName: "Acciones",
        width: 120,
        cellRenderer: ActionsCellRenderer,
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    [isLoading]
  );

  const handleCreate = () => {
    setModalMode("create");
    setSelectedRow(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: UserSchoolData) => {
    setModalMode("edit");
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: Id<"userSchool">) => {
    if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      setIsLoading(true);
      try {
        // await deleteUserSchool({ id })
        toast.success("Registro eliminado exitosamente");
      } catch (error) {
        toast.error(
          "Error al eliminar el registro: " + (error as Error).message
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const handleSave = async (data: Omit<UserSchoolData, "_id" | "createdAt" | "updatedAt">) => {
  //   setIsLoading(true)
  //   try {
  //     if (modalMode === "create") {
  //      // await createUserSchool(data)
  //       toast.success("Registro creado exitosamente")
  //     } else if (selectedRow) {
  //       //await updateUserSchool({
  //         id: selectedRow._id,
  //         ...data,
  //       })
  //       toast.success("Registro actualizado exitosamente")
  //     }
  //     setIsModalOpen(false)
  //   } catch (error) {
  //     toast.error("Error al guardar: " + (error as Error).message)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  // const displayStats = useMemo(() => {
  //   if (!stats) return { total: 0, active: 0, schools: 0 }
  //   return {
  //     total: stats.total,
  //     active: stats.active,
  //     schools: stats.uniqueSchools,
  //   }
  // }, [stats])

  // if (userSchoolData === undefined) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <RefreshCw className="h-8 w-8 animate-spin" />
  //       <span className="ml-2">Cargando datos...</span>
  //     </div>
  //   )
  // }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administración Usuario-Escuela</h1>
          <p className="text-muted-foreground">
            Gestiona las relaciones entre usuarios y escuelas
          </p>
        </div>
        <Button onClick={handleCreate} className="w-fit" disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Registro
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registros
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{displayStats.total}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{displayStats.active}</div> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escuelas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{displayStats.schools}</div> */}
          </CardContent>
        </Card>
      </div>

      {/* Tabla AG Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Usuario-Escuela</CardTitle>
          <CardDescription>
            Lista completa de relaciones entre usuarios y escuelas con sus roles
            y permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={userSchoolData || []}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: false,
              }}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={20}
              rowSelection="single"
              animateRows={true}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      {/* <UserSchoolFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        initialData={selectedRow}
        isLoading={isLoading}
      /> */}
    </div>
  );
}
