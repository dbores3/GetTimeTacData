@extends('app')
@section('content')
<h1>Time Tac</h1>
<h2>List of users</h2>
	<br>
	<br>
        <table class="display" id="usersTable" width="100%" data-name="Users">
            <thead class="thead-dark">
                <tr class="w3-cyan">
                    <th data-priority="1">ID</th>
                    <th data-priority="3">First Name</th>
                    <th data-priority="4">Last Name</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($users as $user)
                    <tr>
                        <td>{{ $user['id'] }}</td>
                        <td>{{ $user['firstname'] }}</td>
                        <td>{{ $user['lastname'] }}</td>
                    </tr>
                @empty
                    <tr>
                        No users found!
                    </tr>
                @endforelse
            </tbody>
        </table>
@endsection
@section('css')
    <link href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" rel="stylesheet">
@endsection
@section('page-script')
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script src="{{asset('js/table-data.js')}}"></script>
    {{-- EXPORT --}}
    <script src="{{asset('js/downloadfiles.js')}}"></script>
@endsection
