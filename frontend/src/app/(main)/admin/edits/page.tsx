'use client';

import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Eye, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// ── Mock data for edit requests ──
interface EditRequest {
    id: string;
    requesterName: string;
    requesterRole: string;
    targetHandle: string;
    targetName: string;
    editType: string;
    fieldChanges: Record<string, { old: string; new: string }>;
    reason?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewerName?: string;
    reviewNote?: string;
    createdAt: string;
    reviewedAt?: string;
}

const MOCK_EDITS: EditRequest[] = [
    {
        id: 'e1',
        requesterName: 'Lê Huy',
        requesterRole: 'MEMBER',
        targetHandle: 'P16',
        targetName: 'Lê Minh Phong',
        editType: 'UPDATE_PERSON',
        fieldChanges: {
            phone: { old: '—', new: '0912 345 678' },
            occupation: { old: '—', new: 'Giáo viên' },
        },
        reason: 'Cập nhật thông tin liên hệ của ba',
        status: 'PENDING',
        createdAt: '2026-02-20T00:30:00',
    },
    {
        id: 'e2',
        requesterName: 'Lê Huy',
        requesterRole: 'MEMBER',
        targetHandle: 'P25',
        targetName: 'Lê Huy',
        editType: 'UPDATE_PERSON',
        fieldChanges: {
            email: { old: 'lehuy98@gmail.com', new: 'lehuy.dev@gmail.com' },
        },
        status: 'APPROVED',
        reviewerName: 'Admin',
        reviewNote: 'OK, đã xác minh',
        createdAt: '2026-02-19T22:00:00',
        reviewedAt: '2026-02-19T23:00:00',
    },
    {
        id: 'e3',
        requesterName: 'Lê Thành Trung',
        requesterRole: 'EDITOR',
        targetHandle: 'P01',
        targetName: 'Lê Văn Tổ',
        editType: 'UPDATE_PERSON',
        fieldChanges: {
            birthPlace: { old: '—', new: 'Hà Tĩnh' },
            biography: { old: '—', new: 'Thủy tổ dòng họ Lê Huy, quê gốc Hà Tĩnh.' },
        },
        reason: 'Bổ sung thông tin thủy tổ từ sách gia phả cũ',
        status: 'APPROVED',
        reviewerName: 'Auto-approved',
        reviewNote: 'Auto-approved (bypass role)',
        createdAt: '2026-02-19T20:00:00',
        reviewedAt: '2026-02-19T20:00:00',
    },
    {
        id: 'e4',
        requesterName: 'Lê Huy',
        requesterRole: 'MEMBER',
        targetHandle: 'P17',
        targetName: 'Trần Thị Hà',
        editType: 'UPDATE_PERSON',
        fieldChanges: {
            phone: { old: '—', new: '0987 111 222' },
            hometown: { old: '—', new: 'Nghệ An' },
        },
        status: 'REJECTED',
        reviewerName: 'Admin',
        reviewNote: 'Số điện thoại không chính xác, vui lòng kiểm tra lại',
        createdAt: '2026-02-19T18:00:00',
        reviewedAt: '2026-02-19T19:00:00',
    },
];

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
    PENDING: { label: 'Chờ duyệt', variant: 'outline', icon: Clock },
    APPROVED: { label: 'Đã duyệt', variant: 'default', icon: CheckCircle2 },
    REJECTED: { label: 'Từ chối', variant: 'destructive', icon: XCircle },
};

const EDIT_TYPE_LABELS: Record<string, string> = {
    UPDATE_PERSON: 'Cập nhật',
    CREATE_PERSON: 'Thêm mới',
    DELETE_PERSON: 'Xóa',
    ADD_SPOUSE: 'Thêm vợ/chồng',
};

export default function AdminEditsPage() {
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [selectedEdit, setSelectedEdit] = useState<EditRequest | null>(null);
    const [reviewNote, setReviewNote] = useState('');

    const filteredEdits = filterStatus === 'ALL'
        ? MOCK_EDITS
        : MOCK_EDITS.filter(e => e.status === filterStatus);

    const pendingCount = MOCK_EDITS.filter(e => e.status === 'PENDING').length;

    const handleApprove = (edit: EditRequest) => {
        // TODO: API call
        alert(`Đã duyệt yêu cầu ${edit.id}`);
        setSelectedEdit(null);
        setReviewNote('');
    };

    const handleReject = (edit: EditRequest) => {
        if (!reviewNote.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }
        // TODO: API call
        alert(`Đã từ chối yêu cầu ${edit.id}: ${reviewNote}`);
        setSelectedEdit(null);
        setReviewNote('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ClipboardCheck className="h-6 w-6" />
                        Kiểm duyệt thông tin
                    </h1>
                    <p className="text-muted-foreground">
                        Duyệt các yêu cầu chỉnh sửa từ thành viên
                        {pendingCount > 0 && (
                            <Badge variant="destructive" className="ml-2">
                                {pendingCount} chờ duyệt
                            </Badge>
                        )}
                    </p>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                    <Button
                        key={s}
                        variant={filterStatus === s ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus(s)}
                        className="gap-1"
                    >
                        {s === 'ALL' && <Filter className="h-3 w-3" />}
                        {s === 'ALL' ? 'Tất cả' : STATUS_CONFIG[s].label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                            {s === 'ALL' ? MOCK_EDITS.length : MOCK_EDITS.filter(e => e.status === s).length}
                        </Badge>
                    </Button>
                ))}
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Danh sách yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Người gửi</TableHead>
                                <TableHead>Đối tượng</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Thay đổi</TableHead>
                                <TableHead>Ngày gửi</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="w-20"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEdits.map(edit => {
                                const statusCfg = STATUS_CONFIG[edit.status];
                                const StatusIcon = statusCfg.icon;
                                const changeCount = Object.keys(edit.fieldChanges).length;
                                return (
                                    <TableRow key={edit.id}>
                                        <TableCell>
                                            <div>
                                                <span className="font-medium">{edit.requesterName}</span>
                                                <span className="text-xs text-muted-foreground ml-1">{edit.requesterRole}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{edit.targetName}</span>
                                            <span className="text-xs text-muted-foreground ml-1">({edit.targetHandle})</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{EDIT_TYPE_LABELS[edit.editType] || edit.editType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">{changeCount} trường</span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(edit.createdAt).toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusCfg.variant} className="gap-1">
                                                <StatusIcon className="h-3 w-3" />
                                                {statusCfg.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => { setSelectedEdit(edit); setReviewNote(''); }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredEdits.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Không có yêu cầu nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog open={!!selectedEdit} onOpenChange={() => setSelectedEdit(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Chi tiết yêu cầu chỉnh sửa</DialogTitle>
                        <DialogDescription>
                            {selectedEdit?.requesterName} → {selectedEdit?.targetName} ({selectedEdit?.targetHandle})
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEdit && (
                        <div className="space-y-4">
                            {/* Edit Type & Reason */}
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{EDIT_TYPE_LABELS[selectedEdit.editType]}</Badge>
                                {selectedEdit.reason && (
                                    <span className="text-sm text-muted-foreground italic">"{selectedEdit.reason}"</span>
                                )}
                            </div>

                            {/* Field Changes Diff */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Thay đổi:</p>
                                <div className="rounded-md border divide-y">
                                    {Object.entries(selectedEdit.fieldChanges).map(([field, change]) => (
                                        <div key={field} className="p-3 text-sm">
                                            <span className="font-medium text-muted-foreground">{field}</span>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="line-through text-red-500">{change.old || '—'}</span>
                                                <span>→</span>
                                                <span className="text-green-600 font-medium">{change.new}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Existing review info */}
                            {selectedEdit.status !== 'PENDING' && (
                                <div className="p-3 rounded-md bg-muted text-sm">
                                    <p><strong>Người duyệt:</strong> {selectedEdit.reviewerName}</p>
                                    {selectedEdit.reviewNote && <p><strong>Ghi chú:</strong> {selectedEdit.reviewNote}</p>}
                                    <p><strong>Ngày duyệt:</strong> {new Date(selectedEdit.reviewedAt!).toLocaleString('vi-VN')}</p>
                                </div>
                            )}

                            {/* Review actions (PENDING only) */}
                            {selectedEdit.status === 'PENDING' && (
                                <div className="space-y-3 pt-2 border-t">
                                    <Textarea
                                        placeholder="Ghi chú khi duyệt/từ chối (bắt buộc khi từ chối)..."
                                        value={reviewNote}
                                        onChange={e => setReviewNote(e.target.value)}
                                        rows={2}
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            onClick={() => handleApprove(selectedEdit)}
                                        >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Duyệt
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleReject(selectedEdit)}
                                        >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Từ chối
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
