<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $dataValidate = $this->validateRequest($request);
        if ($dataValidate) return response()->json($dataValidate, 400);

        $customer = Customer::create([
            'nrodocumento' => $request->nrodocumento,
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'correo' => $request->correo,
            'telefono' => $request->telefono
        ]);

        if (!$customer) {
            return response()->json(['Error al registrar cliente'], 400);
        }

        return response()->json([
            'message' => 'Se ha registrado correctamente',
            'data' => $customer
        ]);
    }

    private function validateRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nrodocumento' => 'required|min:8|max:11',
            'nombre' => 'required|min:3',
            'apellido' => 'required|min:3',
            'correo' => 'nullable|email|max:100',
            'telefono' => 'nullable|min:9'
        ]);

        if ($validator->fails()) {
            return [
                'message' => 'Error al validar datos',
                'errors' => $validator->errors()
            ];
        }

        return null;
    }

    public function update(Request $request, string $id)
    {
        $customer = Customer::find($id);
        if (!$customer) return response()->json(['Cliente no encontrado'], 400);

        $dataValidate = $this->validateRequest($request);
        if ($dataValidate) return response()->json($dataValidate, 400);

        $customer->nrodocumento = $request->nrodocumento;
        $customer->nombre = $request->nombre;
        $customer->apellido = $request->apellido;
        $customer->correo = $request->correo;
        $customer->telefono = $request->telefono;
        $customer->update();

        return response()->json([
            'message' => 'Se ha modificado correctamente',
            'data' => $customer
        ]);
    }

    public function show(string $id)
    {
        $customer = Customer::find($id);
        if (!$customer) return response()->json(['Cliente no encontrado'], 400);

        $data = [
            'nombre' => $customer->nombre,
            'apellido' => $customer->apellido,
            'nrodocumento' => $customer->nrodocumento,
            'correo' => $customer->correo,
            'telefono' => $customer->telefono
        ];

        return response()->json(['data' => $data]);
    }
}
