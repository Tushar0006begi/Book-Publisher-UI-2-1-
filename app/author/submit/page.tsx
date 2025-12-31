"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SubmitManuscriptPage() {
  const [manuscriptTitle, setManuscriptTitle] = useState("")
  const [signedAgreement, setSignedAgreement] = useState<File | null>(null)
  const [agreementError, setAgreementError] = useState<string>("")
  const [copyrightAssigned, setCopyrightAssigned] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [agreementId, setAgreementId] = useState<string | null>(null)

  const handleAgreementUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      setAgreementError("Please upload a PDF file only")
      setSignedAgreement(null)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setAgreementError("File size must be less than 10MB")
      setSignedAgreement(null)
      return
    }

    setSignedAgreement(file)
    setAgreementError("")
    setUploadSuccess(false)

    await uploadToSupabase(file)
  }

  const uploadToSupabase = async (file: File) => {
    setUploading(true)
    setAgreementError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("manuscriptTitle", manuscriptTitle || "Untitled")

      const response = await fetch("/api/upload-agreement", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setUploadSuccess(true)
      setAgreementId(data.agreement.id)
    } catch (error) {
      setAgreementError(error instanceof Error ? error.message : "Failed to upload agreement")
      setSignedAgreement(null)
      setUploadSuccess(false)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAgreement = () => {
    setSignedAgreement(null)
    setCopyrightAssigned(false)
    setAgreementError("")
    setUploadSuccess(false)
    setAgreementId(null)
  }

  const handleCopyrightChange = async (checked: boolean) => {
    if (!agreementId) return

    try {
      const response = await fetch("/api/assign-copyright", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agreementId,
          copyrightAssigned: checked,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update copyright assignment")
      }

      setCopyrightAssigned(checked)
    } catch (error) {
      setAgreementError("Failed to update copyright assignment")
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Submit Manuscript</h1>
        <p className="text-muted-foreground">Upload your manuscript and provide details for publisher review</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Manuscript Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Manuscript</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, TXT (Max 50MB)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Manuscript Versions</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 border border-border rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">manuscript-v1.pdf</p>
                    <p className="text-xs text-muted-foreground">Uploaded 2 days ago • 2.4 MB</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Version
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={manuscriptTitle}
                onChange={(e) => setManuscriptTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN (Optional)</Label>
              <Input id="isbn" placeholder="978-3-16-148410-0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiction">Fiction</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="self-help">Self-Help</SelectItem>
                  <SelectItem value="philosophy">Philosophy</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="synopsis">Synopsis</Label>
              <Textarea id="synopsis" rows={6} placeholder="Provide a compelling synopsis of your book..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wordCount">Word Count</Label>
              <Input id="wordCount" type="number" placeholder="75000" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publisher Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> You must complete the following steps before submitting:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Download and print the publisher agreement form</li>
                  <li>Fill out the agreement in hardcopy and sign it</li>
                  <li>Get your signature verified by a notary or authorized person</li>
                  <li>Scan or photograph the signed agreement as a PDF</li>
                  <li>Upload the signed PDF below</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Step 1: Download Agreement Form</Label>
              <Button variant="outline" className="w-full bg-transparent">
                <FileText className="h-4 w-4 mr-2" />
                Download Publisher Agreement Form (PDF)
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Step 2: Upload Signed & Verified Agreement</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a scanned PDF of your signed and verified agreement
              </p>

              {!signedAgreement ? (
                <div>
                  <label htmlFor="agreement-upload" className="block">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">Click to upload signed agreement</p>
                      <p className="text-xs text-muted-foreground">PDF format only (Max 10MB)</p>
                    </div>
                  </label>
                  <input
                    id="agreement-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleAgreementUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center gap-2 p-3 border rounded-lg ${
                    uploadSuccess ? "border-green-200 bg-green-50" : "border-border bg-background"
                  }`}
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-blue-600 flex-shrink-0 animate-spin" />
                  ) : uploadSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${uploadSuccess ? "text-green-900" : "text-foreground"}`}
                    >
                      {signedAgreement.name}
                    </p>
                    <p className={`text-xs ${uploadSuccess ? "text-green-700" : "text-muted-foreground"}`}>
                      {(signedAgreement.size / 1024 / 1024).toFixed(2)} MB
                      {uploading && " • Uploading..."}
                      {uploadSuccess && " • Uploaded successfully"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAgreement}
                    disabled={uploading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              )}

              {agreementError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {agreementError}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="assignCopyright"
                disabled={!uploadSuccess}
                checked={copyrightAssigned}
                onCheckedChange={handleCopyrightChange}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="assignCopyright"
                  className={`font-medium ${uploadSuccess ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                >
                  Assign copyright to a Publisher
                </Label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, you confirm that you have uploaded a signed and verified agreement, and you
                  agree to transfer copyright ownership to the accepting publisher as per the publishing contract terms.
                </p>
                {!uploadSuccess && (
                  <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    You must upload a signed agreement before you can assign copyright
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button size="lg">Submit for Review</Button>
          <Button size="lg" variant="outline" className="bg-transparent">
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  )
}
