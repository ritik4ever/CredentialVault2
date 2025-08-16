"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useCredentials } from "@/hooks/use-credentials"
import { IssueCredentialDialog } from "@/components/issue-credential-dialog"
import { VerifyCredentialDialog } from "@/components/verify-credential-dialog"
import {
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  Award,
  Users,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Share,
  Bell,
  Settings,
  LogOut,
  Home,
  FileText,
  Verified,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { credentials, isLoading, error, fetchCredentials } = useCredentials()

  // Calculate stats from real data
  const totalCredentials = credentials.length
  const verifiedCredentials = credentials.filter((c) => c.isValid && c.status === 0).length
  const pendingCredentials = credentials.filter((c) => c.status === 1).length
  const revokedCredentials = credentials.filter((c) => c.status === 2).length

  const getStatusBadge = (credential: any) => {
    if (!credential.isValid || credential.status === 2) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          {credential.status === 2 ? "Revoked" : "Invalid"}
        </Badge>
      )
    }
    if (credential.status === 1) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r border-border/50 backdrop-blur-sm bg-card/30">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CredentialVault</span>
            </div>

            <nav className="space-y-2">
              <a
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
              <a
                href="/dashboard/credentials"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                <Award className="h-5 w-5" />
                <span>My Credentials</span>
              </a>
              <a
                href="/dashboard/issue"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Issue Credential</span>
              </a>
              <a
                href="/dashboard/verify"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                <Verified className="h-5 w-5" />
                <span>Verify</span>
              </a>
              <a
                href="/dashboard/analytics"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </a>
            </nav>

            <div className="mt-8 pt-8 border-t border-border/50">
              <nav className="space-y-2">
                <a
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </a>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="border-b border-border/50 backdrop-blur-sm bg-card/30">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.email || user?.address?.slice(0, 6) + "..." + user?.address?.slice(-4)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="backdrop-blur-sm bg-card/50 border-border/50">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user?.email ? user.email[0].toUpperCase() : user?.address?.[2]?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Credentials</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCredentials}</div>
                  <p className="text-xs text-muted-foreground">
                    {credentials.length > 0 ? "Stored on blockchain" : "No credentials yet"}
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{verifiedCredentials}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalCredentials > 0
                      ? `${Math.round((verifiedCredentials / totalCredentials) * 100)}% verification rate`
                      : "0% verification rate"}
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCredentials}</div>
                  <p className="text-xs text-muted-foreground">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revoked</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{revokedCredentials}</div>
                  <p className="text-xs text-muted-foreground">No longer valid</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="credentials" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="backdrop-blur-sm bg-card/30 border-border/50">
                  <TabsTrigger value="credentials">My Credentials</TabsTrigger>
                  <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                  <TabsTrigger value="shared">Shared With Me</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search credentials..."
                      className="pl-10 backdrop-blur-sm bg-input/50 border-border/50"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="backdrop-blur-sm bg-card/50 border-border/50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <IssueCredentialDialog />
                  <VerifyCredentialDialog />
                </div>
              </div>

              <TabsContent value="credentials" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading credentials...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <AlertCircle className="h-8 w-8 text-destructive mr-2" />
                    <span className="text-destructive">{error}</span>
                    <Button variant="outline" size="sm" onClick={fetchCredentials} className="ml-4 bg-transparent">
                      Retry
                    </Button>
                  </div>
                ) : credentials.length === 0 ? (
                  <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                    <CardContent className="text-center py-8">
                      <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No credentials found.</p>
                      <IssueCredentialDialog />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {credentials.map((credential) => (
                      <Card
                        key={credential.id}
                        className="backdrop-blur-sm bg-card/30 border-border/50 hover:bg-card/40 transition-all duration-300"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Award className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {credential.metadata?.title || credential.credentialType}
                                </CardTitle>
                                <CardDescription>
                                  {credential.metadata?.issuer || credential.issuerDID.slice(0, 20) + "..."} • Issued{" "}
                                  {formatDate(credential.issuanceDate)}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(credential)}
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>ID: {credential.id.slice(0, 12)}...</span>
                              <span>•</span>
                              <span>Type: {credential.credentialType}</span>
                              {credential.expirationDate > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Expires: {formatDate(credential.expirationDate)}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest credential activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {credentials.slice(0, 5).map((credential, index) => (
                        <div key={credential.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {credential.metadata?.title || credential.credentialType} verified
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(credential.issuanceDate)}</p>
                          </div>
                        </div>
                      ))}
                      {credentials.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shared" className="space-y-4">
                <Card className="backdrop-blur-sm bg-card/30 border-border/50">
                  <CardHeader>
                    <CardTitle>Shared With Me</CardTitle>
                    <CardDescription>Credentials that others have shared with you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No credentials have been shared with you yet.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
