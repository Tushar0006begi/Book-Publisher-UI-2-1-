import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

const submissions = [
  {
    id: 1,
    title: "The Digital Mind",
    category: "Technology",
    submittedDate: "January 15, 2024",
    status: "accepted",
    publisher: "TechPress Publishing",
    feedback: "Excellent manuscript! We're excited to publish this work.",
  },
  {
    id: 2,
    title: "Future of AI",
    category: "Technology",
    submittedDate: "January 10, 2024",
    status: "pending",
    publisher: "Pending Review",
    feedback: null,
  },
  {
    id: 3,
    title: "Code Philosophy",
    category: "Technology",
    submittedDate: "December 20, 2023",
    status: "rejected",
    publisher: "Modern Books Ltd",
    feedback:
      "While the content is solid, we feel it doesn't align with our current publishing direction. We encourage you to revise and resubmit.",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "default"
    case "pending":
      return "secondary"
    case "rejected":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function SubmissionsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">Track the status of your manuscript submissions</p>
        </div>
        <Button asChild>
          <a href="/author/submit">New Submission</a>
        </Button>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">{submission.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {submission.category} • Submitted {submission.submittedDate}
                  </p>
                </div>
                <Badge variant={getStatusColor(submission.status)}>{submission.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Publisher</p>
                  <p className="text-sm text-muted-foreground">{submission.publisher}</p>
                </div>
                {submission.feedback && (
                  <div>
                    <p className="text-sm font-medium mb-1">Feedback</p>
                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Manuscript
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
