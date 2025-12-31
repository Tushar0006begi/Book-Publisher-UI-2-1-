import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Check, X, Download } from "lucide-react"

const submissions = [
  {
    id: 1,
    title: "Future of AI",
    author: "Sarah Chen",
    category: "Technology",
    submittedDate: "January 10, 2024",
    wordCount: 85000,
    status: "pending",
    synopsis:
      "An in-depth exploration of artificial intelligence's trajectory and its implications for society, business, and human consciousness.",
  },
  {
    id: 2,
    title: "Urban Gardens",
    author: "Maria Garcia",
    category: "Lifestyle",
    submittedDate: "January 8, 2024",
    wordCount: 62000,
    status: "pending",
    synopsis:
      "A comprehensive guide to creating thriving gardens in urban environments, with practical tips for small spaces and container gardening.",
  },
  {
    id: 3,
    title: "Leadership Reimagined",
    author: "Alex Thompson",
    category: "Business",
    submittedDate: "January 5, 2024",
    wordCount: 71000,
    status: "pending",
    synopsis:
      "Modern leadership principles for the 21st century, focusing on empathy, adaptability, and sustainable business practices.",
  },
]

export default function SubmissionsInboxPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Submissions Inbox</h1>
        <p className="text-muted-foreground">Review and manage manuscript submissions from authors</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({submissions.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{submission.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      by {submission.author} • {submission.category}
                    </p>
                  </div>
                  <Badge>{submission.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">{submission.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Word Count</p>
                      <p className="font-medium">{submission.wordCount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Synopsis</p>
                    <p className="text-sm">{submission.synopsis}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Manuscript
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" className="ml-auto">
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button size="sm" variant="destructive">
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No accepted submissions</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No rejected submissions</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
