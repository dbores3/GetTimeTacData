<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Time Tac Users module">
    <meta name="author" content="DavidBores">
    <meta name="theme-color" content="#102040"/>
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>TimeTac{{-- config('app.name', 'TimeTac') --}}</title>
    
    {{-- ADDTIONAL CSS FILES --}}
    @yield('css')
</head>
<body>
<section class="content @yield('classcontent', '')">
    @yield('content')
</section>
    {{-- JS FILES--}}
    @yield('page-script')
</body>
</html>
