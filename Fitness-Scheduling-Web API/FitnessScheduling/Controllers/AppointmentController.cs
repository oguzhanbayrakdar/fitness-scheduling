using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitnessScheduling.Data;
using FitnessScheduling.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace FitnessScheduling.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private AppointmentRepository _appointmentRepository;
        public AppointmentController(AppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpPost("addappointment")]
        [Authorize]
        public IActionResult AddAppointmentAsync([FromBody]Appointment appointment, Guid userId)
        {
            var _appointment = _appointmentRepository.AddAppointmentAsync(appointment, userId);

            if (_appointment == null)
            {
                return BadRequest("An Error Occurred While Adding the Appointment.");
            }

            return Ok(_appointment);
        }

        [HttpGet("ByPlace")]
        [Authorize]
        public IActionResult GetAppointmentByPlace(Guid placeId)
        {
            var today = DateTime.Today;

            var appointments = _appointmentRepository.GetAppointmentByOwnerId(placeId)
                .Include(c => c.User)
                .OrderByDescending(c => c.StartDate);

            foreach (var appointment in appointments)
            {
                appointment.FullName = appointment.User.Name + " " + appointment.User.LastName;
                appointment.Place = null;
                appointment.User = null;
            }

            if (appointments.Any())
            {
                return Ok(appointments.ToList());
            }

            return BadRequest("An Error Occurred While Fetching Data.");
        }

        [HttpGet("ByUser")]
        [Authorize]
        public IActionResult GetAppointmentByUser(Guid userId)
        {

            try
            {
                var appointments = _appointmentRepository
                    .GetAppointmentsByUser(userId)
                    .Include(c => c.Place)
                    .OrderByDescending(c => c.StartDate)
                    .ToList();
                if (appointments.Any())
            {
                    return Ok(appointments);
                }

                return BadRequest(400);
            }
            catch (Exception e)
            {
                return BadRequest(404);
            }

        }

        [HttpPost("RejectOrConfirmAppointment")]
        [Authorize]
        public IActionResult RejectOrConfirmAppointment([FromBody]JObject data)
        {
            var id = data.Value<string>("appointmentId");
            var status = data.Value<bool>("status");

            var appointment = _appointmentRepository.RejectOrConfirmAppointment(new Guid(id), status);

            if (appointment == null)
            {
                return BadRequest(false);
            }

            appointment.Place = null;
            return Ok(appointment);
        }

    }
}