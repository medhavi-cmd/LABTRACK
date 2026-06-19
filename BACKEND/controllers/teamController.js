import { 
    getStudentByEnrollment, 
    registerTeam 
} from "../services/teamService.js";

// Fetch student details by their enrollment number
export const fetchStudentByEnrollment = async (req, res) => {
    try {
        const { enrollmentNo } = req.params;
        const student = await getStudentByEnrollment(enrollmentNo);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        return res.json(student);
    } catch (error) {
        console.error("Error in fetchStudentByEnrollment:", error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// Create a new team and associate projects/members
export const createTeam = async (req, res) => {
    try {
        const team = await registerTeam(req.body);
        return res.status(201).json(team);
    } catch (error) {
        console.error("Error in createTeam:", error);
        return res.status(500).json({
            message: error.message || "Failed to register team"
        });
    }
};