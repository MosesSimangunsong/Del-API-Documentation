import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

// --- (1) Import Komponen Layout & Form ---
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/Components/ui/resizable";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs"; // Untuk editor (Params, Body, dll)
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { PlusCircle, Save } from 'lucide-react'; // Ikon

// --- (2) Komponen Utama (Sekarang menerima 'project' dari Laravel) ---
export default function ApiTester({ project }) {

    // --- (3) State Management ---
    // State untuk endpoint yang sedang AKTIF/DIPILIH
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);

    // State untuk form editor (Body)
    const [bodyContent, setBodyContent] = useState('');
    // State untuk form editor (Endpoint)
    const [endpointPath, setEndpointPath] = useState('');
    const [endpointMethod, setEndpointMethod] = useState('GET');
    
    // --- (4) Efek untuk Sinkronisasi Form ---
    // Efek ini berjalan setiap kali 'selectedEndpoint' berubah
    useEffect(() => {
        if (selectedEndpoint) {
            // Jika ada endpoint dipilih, isi form dengan datanya
            setBodyContent(selectedEndpoint.body || '');
            setEndpointPath(selectedEndpoint.path || '');
            setEndpointMethod(selectedEndpoint.method || 'GET');
        } else {
            // Jika tidak ada, kosongkan form
            setBodyContent('');
            setEndpointPath('');
            setEndpointMethod('GET');
        }
    }, [selectedEndpoint]); // <-- "Dengarkan" perubahan pada selectedEndpoint

    // --- (5) Fungsi Handler untuk Aksi ---

    /**
     * Dipanggil saat pengguna mengklik nama endpoint di sidebar
     */
    const handleSelectEndpoint = (endpoint) => {
        setSelectedEndpoint(endpoint);
    };

    /**
     * Dipanggil saat pengguna mengklik tombol "Save"
     * Ini menyimpan perubahan ke endpoint yang SEDANG DIPILIH
     */
    const handleSave = () => {
        if (!selectedEndpoint) {
            alert('Pilih endpoint terlebih dahulu untuk disimpan.');
            return;
        }

        // Kirim data ke backend menggunakan Inertia router
        router.patch(
            route('endpoints.update', { endpoint: selectedEndpoint.id }), // Nama route Laravel
            {
                // Data yang dikirim
                path: endpointPath,
                method: endpointMethod,
                body: bodyContent,
                // Anda bisa tambahkan params, headers, dll di sini
            },
            {
                preserveState: true, // Jaga state React agar UI tidak 'flicker'
                preserveScroll: true,
                onSuccess: () => console.log('Tersimpan!'), // Aksi setelah sukses
            }
        );
    };

    /**
     * Dipanggil saat pengguna klik "Add Endpoint"
     * Ini membuat endpoint BARU di database
     */
    const handleAddEndpoint = () => {
        // Kirim request 'POST' ke route 'endpoints.store'
        router.post(
            route('endpoints.store'), // Nama route Laravel
            {
                project_id: project.id, // Kirim ID proyek
                path: '/new-endpoint',   // Path default
                method: 'GET',
            },
            {
                onSuccess: (page) => {
                    // Setelah sukses, Inertia akan mengirim 'project' baru
                    // Kita bisa pilih endpoint baru tersebut
                    const newEndpoint = page.props.project.folders
                        .flatMap(f => f.endpoints)
                        .find(e => e.path === '/new-endpoint'); // Cari endpoint baru
                    
                    if (newEndpoint) {
                        setSelectedEndpoint(newEndpoint);
                    }
                }
            }
        );
    };

    // --- (6) Tampilan JSX (Layout 3-Kolom) ---
    return (
        <ResizablePanelGroup 
            direction="horizontal"
            className="min-h-screen max-w-full rounded-lg border"
        >
            {/* --- KOLOM 1: Sidebar Navigasi (Daftar Endpoint) --- */}
            <ResizablePanel defaultSize={20} className="min-w-[200px]">
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                    <Button onClick={handleAddEndpoint} variant="outline" size="sm" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Endpoint
                    </Button>
                </div>
                <hr />
                <div className="p-4 space-y-4">
                    {/* Loop Folder (Dinamis dari props) */}
                    {project.folders && project.folders.map(folder => (
                        <div key={folder.id}>
                            <h3 className="font-semibold text-sm mb-2">{folder.name}</h3>
                            <ul className="space-y-1">
                                {/* Loop Endpoint (Dinamis dari props) */}
                                {folder.endpoints && folder.endpoints.map(endpoint => (
                                    <li key={endpoint.id}>
                                        <button
                                            onClick={() => handleSelectEndpoint(endpoint)}
                                            className={`
                                                w-full text-left p-2 rounded-md text-sm 
                                                ${selectedEndpoint?.id === endpoint.id 
                                                    ? 'bg-blue-100 text-blue-800' // Tampilan aktif
                                                    : 'hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            <span className="font-bold w-12 inline-block">
                                                {endpoint.method}
                                            </span>
                                            <span className="truncate">{endpoint.path}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />

            {/* --- KOLOM 2: Editor Utama (Request) --- */}
            <ResizablePanel defaultSize={50} className="min-w-[300px]">
                {!selectedEndpoint ? (
                    // Tampilan jika belum ada endpoint dipilih
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            Pilih endpoint di sebelah kiri atau buat endpoint baru.
                        </p>
                    </div>
                ) : (
                    // Tampilan jika ADA endpoint dipilih
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Request Editor</h2>
                            <Button onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                        
                        {/* Form Edit Endpoint */}
                        <div className="flex gap-2 mb-4">
                            <Input 
                                value={endpointMethod}
                                onChange={e => setEndpointMethod(e.target.value)}
                                className="w-[100px] font-bold"
                            />
                            <Input 
                                value={endpointPath}
                                onChange={e => setEndpointPath(e.target.value)}
                                placeholder="/path/ke/endpoint"
                                className="flex-1 font-mono"
                            />
                        </div>
                        
                        {/* Tabs untuk Body, Params, Headers */}
                        <Tabs defaultValue="body" className="w-full">
                            <TabsList>
                                <TabsTrigger value="params">Params</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                <TabsTrigger value="body">Body</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="params" className="mt-4">
                                <Label>Query Params</Label>
                                <p className="text-sm text-gray-600">(Fitur 'Tambah/Hapus Params' bisa ditambahkan di sini)</p>
                            </TabsContent>
                            
                            <TabsContent value="headers" className="mt-4">
                                <Label>Headers</Label>
                                <p className="text-sm text-gray-600">(Fitur 'Tambah/Hapus Headers' bisa ditambahkan di sini)</p>
                            </TabsContent>

                            <TabsContent value="body" className="mt-4">
                                <Label htmlFor="body-editor">Request Body (JSON)</Label>
                                <Textarea
                                    id="body-editor"
                                    value={bodyContent}
                                    onChange={(e) => setBodyContent(e.target.value)}
                                    placeholder='{ "key": "value" }'
                                    className="h-80 font-mono text-sm bg-gray-50"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </ResizablePanel>
            
            <ResizableHandle withHandle />

            {/* --- KOLOM 3: Editor Response (Contoh) --- */}
            <ResizablePanel defaultSize={30} className="min-w-[250px]">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Response Editor</h2>
                    {selectedEndpoint ? (
                        <div>
                            <Label>Contoh Response Body (JSON)</Label>
                            <Textarea 
                                placeholder='{ "message": "success" }'
                                className="h-80 font-mono text-sm bg-gray-50"
                                // Nanti ini juga dihubungkan ke state dan disimpan
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">Pilih endpoint.</p>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}