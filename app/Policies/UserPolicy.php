<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
class UserPolicy
{
    use HandlesAuthorization;
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function viewAny(User $user)
    {
        return $user->role_id === '1';
    }
}
