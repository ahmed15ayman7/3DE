import { Group } from '@3de/interfaces'
import { Input, Modal, Textarea, Button, LoadingSpinner, UploadImage, Autocomplete } from '@3de/ui'
import { UseMutationResult, useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { communityApi, userApi } from '@3de/apis';
let getUsers = async () => {
    let res = await userApi.getAll(1,1000,"")
    return res.data
}
let getCommunities = async () => {
    let res = await communityApi.getAll()
    return res.data
}

const addGroupModal = ({ isOpen, onClose,createGroupMutation,formData,setFormData,isEdit,selectedGroup,updateGroupMutation  }: { isOpen: boolean, onClose: () => void,createGroupMutation: UseMutationResult<Group, Error, Partial<Group & {members:string[]}>, unknown>,formData: Partial<Group & {members:string[]}>,setFormData: (data: Partial<Group & {members:string[]}>) => void,isEdit: boolean,selectedGroup: Group & {members:string[]} | null,updateGroupMutation: UseMutationResult<Group, Error,{id:string,data:Partial<Group & {members:string[]}>}, unknown>}) => {
    let {data:users,isLoading:usersLoading} = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
        enabled: isOpen
    })
    let {data:communities,isLoading:communitiesLoading} = useQuery({
        queryKey: ['communities'],
        queryFn: () => getCommunities(),
        enabled: isOpen
    })
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGroup && isEdit) {
          updateGroupMutation.mutate({
            id: selectedGroup.id,
            data: formData as any
          });
        } else {
          createGroupMutation.mutate(formData);
        }
      };
      useEffect(() => {
        if (selectedGroup && isEdit) {
          setFormData(selectedGroup);
        }
      }, [selectedGroup]);
    // name: '',
    // subject: '',
    // image: '',
    // members: [],
    // adminId: '',
    // Community: [],
  return (
    <Modal  
    isOpen={isOpen}
    onClose={() =>onClose()}
    title={isEdit ? "تعديل الجروب" : "إنشاء جروب جديد"}
  >
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اسم الجروب *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="أدخل اسم الجروب"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الموضوع
        </label>
        <Textarea
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="أدخل موضوع الجروب"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        الصورة
        </label>
        <UploadImage image={formData.image || ""} setImage={(image:string) => setFormData({ ...formData, image })} inputRef={inputRef as React.RefObject<HTMLInputElement>} isUploading={false} setIsUploading={() => {}} />
      </div>
      <div>
        <Autocomplete label="الأعضاء" placeholder="أدخل اسم الأعضاء" options={users?.map((user) => ({
          value: user.id,
          label: user.firstName + " " + user.lastName
        })) || []} onSelect={(value) => setFormData({ ...formData, members: value as any })} isMulti={true} />
      </div>
      <div>
        <Autocomplete label="المجتمعات" placeholder="أدخل اسم المجتمعات" options={communities?.map((community) => ({
          value: community.id,
          label: community.name
        })) || []} onSelect={(value) => setFormData({ ...formData, communityId: value as any })}  />
      </div>
      <div>
        <Autocomplete label="المدير" placeholder="أدخل اسم المدير" options={users?.map((user) => ({
          value: user.id,
          label: user.firstName + " " + user.lastName
        })) || []} onSelect={(value) => setFormData({ ...formData, adminId: value as any })}  />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose()}
        >
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={createGroupMutation.isPending}
        >
          {createGroupMutation.isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            'إنشاء الجروب'
          )}
        </Button>
      </div>
    </form>
  </Modal>
  )
}

export default addGroupModal