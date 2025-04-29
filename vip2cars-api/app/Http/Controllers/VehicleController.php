<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicleList = Vehicle::with('customer:id,nombre,apellido,nrodocumento')->get();

        $formattedVehicleList = $vehicleList->map(function ($vehicle) {
            return [
                'id' => $vehicle->id,
                'placa' => $vehicle->placa,
                'marca' => $vehicle->marca,
                'modelo' => $vehicle->modelo,
                'anio_fabricacion' => $vehicle->anio_fabricacion,
                'documento_cliente' => $vehicle->customer->nrodocumento,
                'cliente' => $vehicle->customer->nombre . ' ' . $vehicle->customer->apellido
            ];
        });

        return response()->json(['data' => $formattedVehicleList]);
    }

    public function store(Request $request)
    {
        $dataValidate = $this->validateRequest($request);
        if ($dataValidate) return response()->json($dataValidate, 400);

        $customer = Customer::find($request->id_cliente);
        if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 400);

        $vehicle = $customer->vehicles()->create([
            'placa' => $request->placa,
            'marca' => $request->marca,
            'modelo' => $request->modelo,
            'anio_fabricacion' => $request->anio_fabricacion
        ]);

        if (!$vehicle) {
            return response()->json(['message' => 'Error al registrar vehículo'], 400);
        }

        return response()->json([
            'message' => 'Se ha registrado correctamente',
            'data' => $vehicle
        ]);
    }

    private function validateRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_cliente' => 'required',
            'placa' => 'required|min:6|max:6',
            'marca' => 'required',
            'modelo' => 'required',
            'anio_fabricacion' => 'required|min:4|max:4'
        ]);

        if ($validator->fails()) {
            return [
                'message' => 'Error al validar datos',
                'errors' => $validator->errors()
            ];
        }

        return null;
    }

    public function show(string $id)
    {
        $vehicle = Vehicle::find($id);
        if (!$vehicle) return response()->json(['Vehículo no encontrado'], 400);

        $data = [
            'id_cliente' => $vehicle->customer_id,
            'placa' => $vehicle->placa,
            'marca' => $vehicle->marca,
            'modelo' => $vehicle->modelo,
            'anio_fabricacion' => $vehicle->anio_fabricacion
        ];

        return response()->json(['data' => $data]);
    }

    public function update(Request $request, string $id)
    {
        $vehicle = Vehicle::find($id);
        if (!$vehicle) return response()->json(['Vehículo no encontrado'], 400);

        $dataValidate = $this->validateRequest($request);
        if ($dataValidate) return response()->json($dataValidate, 400);

        $customer = Customer::find($request->id_cliente);
        if (!$customer) return response()->json(['message' => 'Cliente no encontrado'], 400);

        $vehicle->customer_id = $customer->id;
        $vehicle->placa = $request->placa;
        $vehicle->marca = $request->marca;
        $vehicle->modelo = $request->modelo;
        $vehicle->anio_fabricacion = $request->anio_fabricacion;
        $vehicle->update();

        return response()->json([
            'message' => 'Se ha modificado correctamente',
            'data' => $vehicle
        ]);
    }

    public function destroy(string $id)
    {
        $vehicle = Vehicle::find($id);
        if (!$vehicle) return response()->json(['Vehículo no encontrado'], 400);

        $vehicle->delete();

        return response()->json([
            'message' => 'Se ha eliminado correctamente',
        ]);
    }

    public function loadInitData()
    {
        $data['clienteList'] = Customer::all(['id', 'nrodocumento', 'nombre', 'apellido']);

        return response()->json([
            'data' => $data
        ]);
    }
}
