using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FitnessScheduling.Models
{
    public class PlaceRegister
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public Owner Owner { get; set; }
    }
}
/*
 *     name: string;
    address: string;
    description: string;
    openingTime: Date;
    closingTime: Date;
    owner: Owner = new Owner(); // [name, lastName, email] içerir.
    password: string;
    confirmPassword: string;
    offDays: Array<number>;

 */
